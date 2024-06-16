# FrogGuard
Embedded System Project

## 작품 설명 
FrogGuard는 양서류의 건강과 편안한 환경을 위해 온습도를 모니터링하고 조절하는 서비스입니다.

최종발표자료 [PDF](./docs/[1-15]임베디드시스템_최종발표자료_고의석,이지민.pdf)

## 개발자
이지민
고의석

## 개발 환경

#React Native
"@react-navigation/native-stack": "^6.9.26",  
"@react-navigation/stack": "^6.3.29",  
"axios": "^1.7.2",  
"openai": "^4.47.2",  
"react": "18.2.0",  
"react-native": "0.74.0",  
"react-native-dotenv": "^3.4.11",  
"react-native-gesture-handler": "^2.16.2",  
"react-native-get-random-values": "^1.11.0",  
"react-native-safe-area-context": "^4.10.1",  
"react-native-screens": "^3.31.1",  
"react-native-vector-icons": "^10.1.0",  
"short-uuid": "^5.2.0",  
"uuid": "^9.0.1"  
  
#Raspberry Pi   
Raspberry Pi 3 Model B  
  
#Flask  
  
#MySQL  
8.0.21  
  
## 사용 방법  
해당 프로그램은 별도의 서버와 데이터베이스, 라즈베리파이와 DHT22 온습도 센서, led, 워터펌프가 필요합니다.  
백엔드 테스팅파일에 yourhost에 서버 ip를 입력해야 합니다.   
