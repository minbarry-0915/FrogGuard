import requests

# Flask 서버 주소
server_address = 'http://192.168.0.7:5000'

def test_add_data():
    # 테스트할 데이터
    data = {
        'cno': 301,
        'name': 'TestName',
        'species': 'TestSpecies',
        'idealMinHumidity': 40.0,
        'idealMaxHumidity': 60.0,
        'idealMinTemperature': 20.0,
        'idealMaxTemperature': 30.0,
        'nightMinTemperature': 15.0,
        'nightMaxTemperature': 25.0,
        'lightStartTime': '18:00',
        'lightEndTime': '06:00'
    }
    
    # POST 요청 보내기
    response = requests.post(f'{server_address}/add_data', json=data)
    
    # 응답 확인
    if response.status_code == 200:
        print("Data added successfully")
    else:
        print("Error:", response.status_code)

if __name__ == "__main__":
    # 테스트 함수 호출
    test_add_data()
