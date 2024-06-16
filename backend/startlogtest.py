import requests

# cno가 101인 데이터로 start_logging 엔드포인트에 POST 요청 보내기
response = requests.post('http://192.168.0.7:5000/start_logging/101')

# 응답 확인
print(response.json())
