# todo-calendar

### 1. 프로젝트 설명

📌 캘린더 기반 일정 관리와 TODO 리스트를 동시에 제공하는 웹 앱입니다.  
📌 사용자는 원하는 날짜와 시간에 일정을 등록하고, Todo 리스트를 통해 오늘의 할 일을 기록하고 완료 여부를 체크할 수 있습니다.  
📌 월별 성취도를 확인할 수 있는 통계 기능과, 하루의 할 일을 모두 완료했는지 한눈에 볼 수 있는 스탬프 기능을 제공합니다.

#### 주요기능

##### 1. Calender 기능

- 캘린더의 빈 곳을 클릭시 일정 추가
- 이미 등록된 일정 클릭시 삭제 팝업 표시
- month, week, day 단위로 일정 확인 가능
  - week, day 에서는 타임라인이 표시되어, 일정이 시간대에 맞게 시각적으로 배치
- Agenda 탭에서 오늘의 일정 모아보기

##### 2. Todo List 기능

- 오늘 할 일 추가 및 완료 체크
- 완료된 항목은 체크박스로 표시
- 삭제 기능은 의도적으로 제외 → "계획한 일을 지키자"라는 의도 반영

##### 3. Statistics 기능

- 오늘 기준 할 일 완료율(%) 제공
- 이번 달의 “할 일 완료 여부”을 달력에 스탬프로 표시 → 한눈에 성취도 확인 가능

##### 4. json-server 사용

- 백엔드를 대신해 dummydata의 일환으로 json-server를 사용해 API 연결

### 2. 소스 빌드 및 실행방법

#### 사전 준비

- Node.js 18 이상 (개발환경: v20.13.1)
- npm

#### 설치

```
git clone <repository-url>
cd front
npm install
```

#### 실행

```
npm run dev
```

- json-server는 자동으로 함께 실행되므로 별도로 실행할 필요가 없습니다.

### 3. 주력으로 사용한 컴포넌트 및 사용이유

#### 1. react-big-calendar

##### React Big Calendar 선택 배경

- 초기에는 MUI의 Calendar 및 Date Range Picker 사용을 고려했으나, 유료 라이선스 이슈로 사용 불가
- 프로젝트 핵심 요구사항인 월/주/일 뷰, 24시간 시간축, 일정 등록/삭제 기능을 모두 제공하는 오픈소스 라이브러리 발견

##### 주요 구현 기능

```javaScript
<Calendar
  localizer={localizer}
  events={events}
  selectable                    // 빈 슬롯 선택 가능
  onSelectSlot={handleSelectSlot}    // 새 일정 생성
  onSelectEvent={handleSelectEvent}  // 기존 일정 선택/삭제
  style={{ height: 500 }}
/>
```

- Moment.js 기반 로컬라이저: 한국 시간대 및 포맷 적용
- 인터랙티브 일정 관리: 클릭으로 일정 생성, 선택으로 삭제
- 사용자 친화적 UI: 시각적으로 직관적인 캘린더 인터페이스

#### 2. MUI Grid & Box

##### 선택 배경

- 반응형 레이아웃과 화면 구성 간격을 쉽게 조정하기 위해 사용

##### 주요 구현 기능

```javaScript
    <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Calendar />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <TodoList />
        </Grid>
    </Grid>
```

- 모바일(xs: 12)에서는 세로 배치, 데스크톱(md: 7:5)에서는 가로 분할
- spacing={2} 속성으로 컴포넌트 간 균등한 여백 적용
- 캘린더 영역과 할 일 목록을 독립적으로 관리

#### 3. MUI Dialog

##### 선택 배경

- 데이터 입력 및 삭제 작업을 위한 모달 시스템 필요
- 엔터키 제출, ESC키 취소 등 키보드 접근성 원활
- 모든 모달에서 동일한 스타일 가이드 적용
- 일정 생성, 할 일 생성, 일정 삭제 등 다양한 곳에서 사용

##### 주요 구현 기능

- 일정 삭제 확인 다디얼로그
```JavaScript
  <Dialog open={open} onClose={onClose} fullWidth>
        <form onSubmit={handleSubmit} id="create-task-form">
          <DialogTitle>할 일 추가</DialogTitle>
          <DialogContent>
            할 일을 입력하세요
            <TextField
              id="task-content"
              label="할 일 내용"
              type="text"
              variant="standard"
              sx={{ mx: 2, width: "80%" }} 
              onChange={(e) => setTaskContent(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>취소</Button>
            <Button type="submit" form="create-task-form">
              저장
            </Button>
          </DialogActions>
        </form>
      </Dialog>
```



### 4. API 명세 (json-server)


| 기능 | 메서드 | URL | 요청 데이터 | 응답 데이터 | 설명 |
|------|--------|-----|------------|------------|------|
| 일정 조회 | GET | `/schedule` | 없음 |`{ title: string, start: string, end: string }` | 등록된 모든 일정 조회 |
| 일정 등록 | POST | `/schedule` | `{ title, start, end }` | 등록된 일정 객체 | 새 일정 추가 |
| 일정 삭제 | DELETE | `/schedule/{eventId}` | 없음 | 삭제 결과 | 특정 일정 삭제 |
| 전체 평점 조회 | GET | `/rating` | 없음 | `number`| 평점 데이터 조회 |
| 달력 스탬프 조회 | GET | `/calstemp` | 없음 | `{ date: string, completed: boolean }` | 달력 스탬프(완료 여부) 정보 조회 |
| Todo 목록 조회 | GET | `/tasks` | 없음 | `{ id: number, content: string, is_done: boolean }` | 오늘 할 일 목록 조회 |
| Todo 등록 | POST | `/tasks` | `{ content: string, is_done: boolean }` | 등록된 Todo 객체 | 오늘 할 일 추가 |
| Todo 완료/미완료 체크 | PATCH | `/tasks/{taskId}` | `{ is_done: boolean }` | 업데이트된 Todo 객체 | 특정 할 일 완료 상태 변경 |


### 5. 사용 기술 스택

#### Frontend

- React 18
- TypeScript
- Vite

#### UI/UX

- Material-UI (MUI)
- Tailwind CSS
- React Big Calendar

#### 개발 도구

- Day.js & Moment.js
- Axios
- ESLint

#### 개발 환경

- JSON Server
- Concurrently
