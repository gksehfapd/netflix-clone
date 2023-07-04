# Netflix-Clone

React를 사용하여 작업해본 넷플릭스 클론 입니다.


React의 전반적인 사용법을 공부하기 위하여 진행한 프로젝트 입니다.

[github.io 바로가기↗](https://gksehfapd.github.io/netflix-clone/)



## 개선사항

- 로딩 애니메이션 구현
- 이미지 없는 경우 대체이미지 또는 문구
- 모바일 등 세로화면 최적화
- 언어변경 (KO, EN)
- Search -> Person에서 대표작 클릭 시 애니메이션
- 2개의 typescript any 해결하기



## 프로젝트 구조

```
src
├── Components/*   
│   └── ContentModal.tsx   # ContentSlider 이미지 클릭 시 작동하는 Modal
│   └── ContentSlider.tsx  # Movie, Tv Slider
│   └── Header.tsx         # Header Components
│   └── PersonModal.tsx    # PersonSlider 이미지 클릭 시 작동하는 Modal
│   └── PersonSlider.tsx   # Person Slider
│
├── Routes/*                  
│   └── Home.tsx           # Home Router
│   └── Search.tsx         # Search Router
│   └── Tv.tsx             # Tv Router
│
├── api.ts                 # Movie, Tv, Person, Cast등 정보를 가져오는 api
├── App.tsx                # 컴포넌트 관계 정의
├── atom.ts                # layoutId, Genres, Cast 저장
├── index.tsx              # 메인 컴포넌트
├── styled.d.ts            # 색 변수 타입 설정
├── theme.ts               # 색 설정 / 컬러코드
└── utils.ts               # api를 통해 가져온 정보로 이미지 제작
```


