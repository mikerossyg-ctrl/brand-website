# 교훈 기록 (Lessons Learned)

코딩 및 전략 교훈. /wrap 세션에서 기록됩니다.
#coding 태그 항목은 SessionStart 시 자동 주입됩니다.
반복 패턴은 /wrap HITL 승급을 통해 적절한 vehicle로 적용됩니다.

## Deployment
### Vercel은 정적 프로젝트에서 서브폴더를 루트로 자동 감지할 수 있다 #coding #vercel
`vercel.json`이나 framework 설정이 없으면 Vercel이 `v2/` 같은 서브디렉토리를 Root Directory로 선택해 배포한다. 결과적으로 `/v2/`, `/1/` 경로는 404가 되고 `/`가 해당 폴더 내용으로 서빙된다. 여러 버전을 경로로 구분해 배포하려면 프로젝트 설정의 Root Directory를 "./"로 명시하거나 `vercel.json`에 `outputDirectory`를 지정해야 한다.

### 배포별 URL은 Deployment Protection으로 로그인이 필요하다 #coding #vercel
`project-xxxxx-team.vercel.app` 형태의 deployment-specific URL은 기본적으로 로그인을 요구한다. 공개 공유용으로는 `project-name.vercel.app`(또는 커스텀 도메인) 같은 안정 프로덕션 URL을 사용해야 한다.
