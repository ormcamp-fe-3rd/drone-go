# 🚀 drone-go
드론 비행 데이터를 직관적으로 이해하고 분석할 수 있도록 도와주는 서비스입니다. 
#### 🗓️ Changelog
`2025-02-07 배포` 
- 서비스 배포

`2025-02-18 배포` 
- (추가) 자세변화 위젯: 회전 축, 사용자 컨트롤 추가
- (추가) 3D 지도에서의 드론 자세변화 반영
- (개선) 2D 지도 마커 이미지 수정
- (개선) 3D 지도 카메라 설정 수정
- (개선) 리팩토링


#### 🔑 로그인 정보
```
ID: test PW: 1234
```

## 프로젝트 소개
### 주요 기능
#### 🏡 Home
- 로그인 및 데이터 목록 제공
- 드론 애니메이션 및 스크롤 효과
#### 🖋️ Introduce
- 서비스의 주요 기능 및 Use Case 소개
#### 📈 Chart
- 비행데이터의 Chart 시각화
- 시간에 따른 연결된 위성 수, 고도와 속도, 배터리 데이터를 Line Chart로 제공
- 드론의 이미지, 비행시간, 상태 메세지 확인
- Chart Export(png, csv 등)
- Chart의 위치 이동
#### 🌎 Map
- 비행데이터의 Map 시각화
- 시간에 따른 2D 지도 이동(위도, 경도, 드론의 머리방향 정보)
- 시간에 따른 3D 지도 이동(위도, 경도, 고도, 드론의 머리방향 정보)
- 드론의 자세 변화 위젯(roll, pitch, yaw)
- 각종 위젯 제공(고도, 속도, 상태 메세지, 배터리, 날씨)
- 비행 애니메이션 재생 및 배속 조정
<br/>

## 실행 방법
#### DB 연결
>`/backend/.env` 파일 생성 및 DB_URI, NASA_API_KEY(날씨 정보 연동) 작성
```
DB_URI='mongodb+srv://<username>:<password>@cluster-<clustername>.uqzc3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-<clustername>'
NASA_API_KEY=<key>
```

#### 지도 연결
>`/frontend/.env` 파일 생성 및 token 입력
```
VITE_MAPBOX_ACCESS_TOKEN=<token>
VITE_CESIUM_ION_API_KEY=<key>
```

#### backend 실행
```
cd backend
npm run dev
```

#### frontend 실행
```
cd frontend
npm run dev
```
<br/>


## 팀원 소개
<table>
  <tr align="center">
    <td>김도연</td>
    <td>김수진</td>
    <td>김혜빈</td>
    <td>반재영 🚩</td>
  </tr>
  <tr>
    <td>
      <div>
        - 차트 페이지 레이아웃<br/>
        - 로봇/오퍼레이션 데이터 선택 헤더<br/>
        - 데이터 차트 시각화<br/>
        - 차트 데이터 엑셀 export<br/>
      </div>
    </td>
    <td>
      <div>
        - 지도 페이지 레이아웃<br/>
        - 지도 위젯 기능<br/>
        - 2D 지도 드론 위치 변화<br/>
        - 날씨 API 연동<br/>
      </div>
    </td>
    <td>
      <div>
        - 3D 드론 모델링, 애니메이션<br/>
        - 메인 페이지 레이아웃, Three Fiber<br/>
        - 메인, 소개 페이지 스크롤 효과<br/>
        - 메인 드론 데이터 목록<br/>
        - 3D 드론 자세변화 위젯<br/>
        - AWS 배포<br/>
      </div>
    </td>
    <td>
      <div>
        - 소개 페이지 레이아웃<br/>
        - 3D 지도 드론 위치 변화<br/>
        - 지도 마커 헤딩 변화<br/>
        - 지도 애니메이션 재생 컨트롤<br/>
        - 미니맵 위젯<br/>
        - 로그인, 로그아웃, AWS 배포<br/>
      </div>
    </td>
  </tr>
  <tr>
    <td><a href="https://github.com/Devkdy22">Devkdy22</a></td>
    <td><a href="https://github.com/ksj0621">ksj0621</a></td>
    <td><a href="https://github.com/hyebinkimsdf">hyebinkimsdf</a></td>
    <td><a href="https://github.com/baaanjy">baaanjy</a></td>
  </tr>
</table>

<br/>

## 🔗
#### [📄 WIKI](https://github.com/ormcamp-fe-3rd/drone-go/wiki/Home)
#### [🎨 피그마](https://www.figma.com/design/eyJ9BGiaD3NO9xKcYjLSLC/DroneGo?node-id=0-1&t=VSSbvUxYUdEaGgDN-1)
