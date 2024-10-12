from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import Adafruit_DHT
import RPi.GPIO as GPIO
import threading
import time

app = Flask(__name__)
CORS(app)  # CORS 설정

# MySQL 데이터베이스 연결 설정
db = mysql.connector.connect(
    host="your host ip",       # MySQL 서버 호스트
    user="root",              # MySQL 사용자 이름
    password="root",          # MySQL 비밀번호
    database="raspi_db"       # 사용할 데이터베이스 이름
)

cursor = db.cursor()

# Adafruit_DHT 센서 설정
DHT_SENSOR = Adafruit_DHT.DHT22
DHT_PIN = 7  # 라즈베리파이 핀 번호 (GPIO 7 사용)

# GPIO 설정
GPIO.setmode(GPIO.BCM)
MOTOR_PIN = 17  # 모터 제어 핀
LED_PIN = 12  # LED 제어 핀
GPIO.setup(MOTOR_PIN, GPIO.OUT)
GPIO.setup(LED_PIN, GPIO.OUT)

# 전역 변수로 스레드와 플래그를 관리
logging_thread = None
stop_thread = False

def log_sensor_data(cno):
    global stop_thread
    while not stop_thread:
        humidity, temperature = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_PIN)
        
        if humidity is not None and temperature is not None:
            # 현재 시간 가져오기
            timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
            
            # 'log' 테이블에 데이터 저장
            log_query = "INSERT INTO log (cageno, time, humidity, temperature) VALUES (%s, %s, %s, %s)"
            log_values = (cno, timestamp, humidity, temperature)
            
            cursor.execute(log_query, log_values)
            db.commit()
            
            print(f"Logged: Temp={temperature:.1f}C  Humidity={humidity:.1f}% at {timestamp}")
            
            # 모터 제어
            ideal_min_humidity, ideal_max_humidity, ideal_min_temperature, ideal_max_temperature = get_ideal_values(cno)
            if ideal_min_humidity is not None and ideal_max_humidity is not None and ideal_min_temperature is not None and ideal_max_temperature is not None:
                if humidity < ideal_min_humidity:
                    GPIO.output(MOTOR_PIN, GPIO.HIGH)
                    print("Motor ON: Humidity is below idealMinHumidity")
                elif humidity > ideal_max_humidity:
                    GPIO.output(MOTOR_PIN, GPIO.LOW)
                    print("Motor OFF: Humidity is above idealMaxHumidity")
                
                # LED 제어
                if temperature < ideal_min_temperature:
                    GPIO.output(LED_PIN, GPIO.HIGH)
                    print("LED ON: Temperature is below idealMinTemperature")
                elif temperature > ideal_max_temperature:
                    GPIO.output(LED_PIN, GPIO.LOW)
                    print("LED OFF: Temperature is above idealMaxTemperature")
            
            # 10초 동안 대기
            time.sleep(10)
        else:
            print("Failed to retrieve data from humidity sensor")
            return

# 주어진 cno에 해당하는 row의 ideal 값들을 가져오는 함수
def get_ideal_values(cno):
    query = "SELECT idealMinHumidity, idealMaxHumidity, idealMinTemperature, idealMaxTemperature FROM data WHERE cno = %s"
    cursor.execute(query, (cno,))
    result = cursor.fetchone()
    if result:
        return result
    else:
        return None

# start_logging 엔드포인트
@app.route('/start_logging/<int:cno>', methods=['POST'])
def start_logging(cno):
    global logging_thread, stop_thread
    stop_thread = False

    # 'data' 테이블에서 해당 cno에 해당하는 row의 isRunning 값을 1로 수정
    update_query = "UPDATE data SET isRunning = 1 WHERE cno = %s"
    cursor.execute(update_query, (cno,))
    db.commit()

    # 백그라운드에서 로그 기록을 시작
    logging_thread = threading.Thread(target=log_sensor_data, args=(cno,))
    logging_thread.start()

    return jsonify({"status": "Logging started"}), 200

# stop_logging 엔드포인트
@app.route('/stop_logging/<int:cno>', methods=['POST'])
def stop_logging(cno):
    global logging_thread, stop_thread
    stop_thread = True

    # 'data' 테이블에서 해당 cno에 해당하는 row의 isRunning 값을 0으로 수정
    update_query = "UPDATE data SET isRunning = 0 WHERE cno = %s"
    cursor.execute(update_query, (cno,))
    db.commit()

    # 백그라운드 스레드가 종료될 때까지 기다림
    if logging_thread is not None:
        logging_thread.join()
    
    # 모터와 LED를 정지
    GPIO.output(MOTOR_PIN, GPIO.LOW)
    GPIO.output(LED_PIN, GPIO.LOW)

    return jsonify({"status": "Logging stopped"}), 200

@app.route('/add_data', methods=['POST'])
def add_data():
    # 안드로이드 애플리케이션으로부터 받은 데이터
    data = request.json
    
    # 데이터베이스에 새로운 행 추가
    data_query = """
    INSERT INTO data (cno, name, species, idealMinHumidity, idealMaxHumidity, idealMinTemperature, idealMaxTemperature, nightMinTemperature, nightMaxTemperature, lightStartTime, lightEndTime, isRunning)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    data_values = (
        data['cno'],
        data['name'],
        data['species'],
        data.get('idealMinHumidity'),
        data.get('idealMaxHumidity'),
        data.get('idealMinTemperature'),
        data.get('idealMaxTemperature'),
        data.get('nightMinTemperature'),
        data.get('nightMaxTemperature'),
        data.get('lightStartTime'),
        data.get('lightEndTime'),
        0  # isRunning은 0으로 설정
    )
    
    cursor.execute(data_query, data_values)
    
    # log 테이블에 새로운 행 추가
    log_query = """
    INSERT INTO log (cageno, time, humidity, temperature)
    VALUES (%s, %s, %s, %s)
    """
    log_values = (
        data['cno'],
        datetime.now(),
        0,  # 초기 humidity 값
        0   # 초기 temperature 값
    )
    
    cursor.execute(log_query, log_values)
    
    db.commit()
    
    return jsonify({"message": "Data added successfully"}), 200

# 안드로이드 애플리케이션에서 GET 요청을 받아서 특정 cno를 기반으로 데이터베이스에서 해당 행을 검색하여 정보를 반환하는 엔드포인트
@app.route('/get_data', methods=['GET'])
def get_data():
    # 데이터베이스에서 모든 데이터 가져오기
    query = """
    SELECT cno, name, species, idealMinHumidity, idealMaxHumidity, idealMinTemperature, idealMaxTemperature, nightMinTemperature, nightMaxTemperature, lightStartTime, lightEndTime
    FROM data
    """
    cursor.execute(query)
    result = cursor.fetchall()
    
    if result:
        # 결과를 JSON 형식으로 반환
        keys = ['cno', 'name', 'species', 'idealMinHumidity', 'idealMaxHumidity', 'idealMinTemperature', 'idealMaxTemperature', 'nightMinTemperature', 'nightMaxTemperature', 'lightStartTime', 'lightEndTime']
        data_list = [dict(zip(keys, row)) for row in result]
        return jsonify(data_list), 200
    else:
        return jsonify({"error": "No data found"}), 404

# 안드로이드 애플리케이션에서 GET 요청을 받아서 특정 cno를 기반으로 데이터베이스에서 해당 행을 검색하여 정보를 반환하는 엔드포인트
@app.route('/get_log', methods=['GET'])
def get_log():
    # 각 cno에 대해 가장 최근에 생성된 row 값만 반환
    query = """
    SELECT d.cno, d.name, d.species, d.isRunning, l.humidity, l.temperature
    FROM data d
    JOIN (
        SELECT cageno, MAX(log_id) AS max_log_id
        FROM log
        GROUP BY cageno
    ) AS latest_log ON d.cno = latest_log.cageno
    JOIN log l ON latest_log.cageno = l.cageno AND latest_log.max_log_id = l.log_id
    """
    cursor.execute(query)
    result = cursor.fetchall()
    
    if result:
        # 결과를 JSON 형식으로 반환
        keys = ['cno', 'name', 'species', 'isRunning', 'humidity', 'temperature']
        data_list = [dict(zip(keys, row)) for row in result]
        return jsonify(data_list), 200
    else:
        return jsonify({"error": "No log data found"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
