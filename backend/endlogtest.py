import requests

def test_stop_logging(cno):
    url = f'http://192.168.0.7:5000/stop_logging/{cno}'
    response = requests.post(url)

    if response.status_code == 200:
        print("stop_logging endpoint test passed")
        print("Response:", response.json())
    else:
        print("stop_logging endpoint test failed")
        print("Status Code:", response.status_code)
        print("Response:", response.text)

if __name__ == "__main__":
    # 테스트할 cno 값을 지정합니다
    test_cno = 101  # 실제 cno 값으로 변경하세요
    test_stop_logging(test_cno)
