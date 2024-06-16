import requests

# Flask 서버 주소
server_address = 'http://192.168.0.7:5000'

def test_get_log():
    # GET 요청 보내기
    response = requests.get(f'{server_address}/get_log')
    
    # 응답 확인
    if response.status_code == 200:
        print("Log data found successfully:")
        print(response.json())
    elif response.status_code == 404:
        print("No log data found")
    else:
        print("Error:", response.status_code)

if __name__ == "__main__":
    # 테스트 함수 호출
    test_get_log()
