
### 📄 목차

> `[알림❗]` 이 저장소의 내용은 학습을 위해 [자바스크립트로 소개팅앱 스타일 카드 스와이프 마스터하기](https://www.youtube.com/watch?v=O0rgN2H9pEY)을 참고하고 기능을 추가한 프로젝트입니다.

## 추가한 기능
- 정적인 JSON 데이터대신 [Lorem Picsum](https://picsum.photos/)의 이미지를 사용하여 다양한 사진을 볼 수 있습니다.
- 

## 코드 리뷰
![image](https://github.com/toa-web-dev/Photoswipe/assets/85207564/70aa3ab6-a6a7-47bf-bd76-8b75a08206ef)

유지보수를 위해 
  - API url을 환경 변수
  - 렌더링할 카드의 수를 정하는 상수
  - 카드를 넘길때 실행되는 스로틀 함수에 사용 되는 상수
    
를 전역으로 선언하여 관리 했습니다. 




## ✔️ 배운 점
- 카드를 스와이프 할 때 발생하는 이벤트 처리에 [pointer이벤트](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)를 사용하여 pc와 모바일 웹에서 mouse와 touch 입력이 모두 가능함을 알았습니다.
