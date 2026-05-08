/**
 * 미션 정의만 모아 둔 파일 — 새 미션 추가 시 여기에 객체를 추가하세요.
 * prerequisites: 완료해야 열리는 선행 미션 id 배열
 * sandbox: play.js / sandbox.js에서 소비
 */

const missions = [
  {
    id: "m_inquiry",
    title: "문의하기 · 폼 제출",
    difficulty: "입문",
    type: "success",
    points: 80,
    summary: "문의 화면으로 이동해 필수 항목을 채우고 제출까지 완료합니다.",
    description: `랜딩에서 **문의하기**로 들어갑니다. 제목과 내용을 입력한 뒤 **문의 보내기**를 눌러 제출이 완료되는지 확인합니다.\n\n이 미션은 “정상 플로우가 끝까지 도는가?”를 연습하는 **성공 시나리오**입니다. 제출 후 토스트 메시지가 뜨는지도 함께 봅니다.`,
    prerequisites: [],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "contact"]
    },
    objectives: [
      { id: "o1", checkId: "visited_contact", text: "문의하기 화면으로 이동한다." },
      { id: "o2", checkId: "submitted_contact_form", text: "문의 폼을 작성하고 제출한다." }
    ]
  },
  {
    id: "m_apply",
    title: "지금 신청하기 · 신청서",
    difficulty: "입문",
    type: "success",
    points: 80,
    summary: "신청 화면에서 이름·이메일·요청 사항을 입력하고 신청을 완료합니다.",
    description: `**지금 신청하기** 화면으로 이동합니다. 이름, 이메일(형식에 맞게), 요청 사항을 채운 뒤 **신청 보내기**로 제출합니다.\n\n실제 서비스라면 유효성 검사·중복 제출·로딩 상태 등을 추가로 테스트하게 됩니다.`,
    prerequisites: [],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "apply"]
    },
    objectives: [
      { id: "o1", checkId: "visited_apply", text: "신청 화면으로 이동한다." },
      { id: "o2", checkId: "submitted_apply_form", text: "신청 폼을 제출한다." }
    ]
  },
  {
    id: "m_plans",
    title: "구매 플랜 조회",
    difficulty: "입문",
    type: "success",
    points: 70,
    summary: "Starter / Pro / Team 플랜 비교 화면을 연다.",
    description: `히어로 또는 허용된 메뉴를 통해 **구매 플랜 조회** 화면에 들어갑니다. 카드에 세 가지 플랜이 보이는지 확인합니다.\n\n가격 문구·CTA 링크·반응형 줄바꿈 등은 실무에서 자주 보는 검증 포인트입니다.`,
    prerequisites: [],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "plans"]
    },
    objectives: [{ id: "o1", checkId: "visited_plans", text: "플랜 비교 화면에 진입한다." }]
  },
  {
    id: "m_bug_nav",
    title: "[버그 탐지] 상단 메뉴와 화면 불일치",
    difficulty: "초급",
    type: "bug_hunt",
    points: 120,
    summary: "같은 이름의 메뉴가 서로 다른 결과를 내는지 찾습니다.",
    description: `상단 **구매 플랜**과 히어로 **구매 플랜 조회**가 **같은 화면으로 가는지** 비교합니다.\n\n어느 한쪽이 잘못 연결되어 있으면 사용자는 혼란스럽고, QA는 **기대 경로 vs 실제 경로**를 짧게 기록해 전달하는 연습을 합니다.\n\n목표를 달성하면 **에러 제보**에 재현 순서를 남겨 보세요.`,
    prerequisites: [],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "contact", "plans"]
    },
    objectives: [
      { id: "o1", checkId: "wrong_plan_nav", text: "상단 메뉴 「구매 플랜」을 눌러 잘못된 화면으로 이동함을 확인한다." },
      { id: "o2", checkId: "visited_plans", text: "히어로 「구매 플랜 조회」로 올바른 플랜 화면에 들어간다." }
    ]
  },
  {
    id: "m_signup",
    title: "회원가입만 하기 (로그인 금지)",
    difficulty: "입문",
    type: "success",
    points: 100,
    summary: "이 미션에서는 가입만 가능합니다. 로그인·게시판은 열리지 않습니다.",
    description: `**회원가입 미션**에서는 아직 “가입 전” 사용자를 가정합니다. 그래서 **로그인·게시판·프로필** 메뉴는 비활성화되어 있습니다.\n\n이름, **유효한 이메일(@ 포함)**, 비밀번호 **8자 이상**을 넣고 가입을 완료하세요. 성공하면 이 프로필에 가입 이메일이 저장되어 **로그인 미션**에서 재사용할 수 있습니다.`,
    prerequisites: [],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "signup", "contact", "apply", "plans"]
    },
    objectives: [
      { id: "o1", checkId: "visited_signup", text: "회원가입 화면으로 이동한다." },
      { id: "o2", checkId: "signup_completed_valid", text: "올바른 정보로 가입을 완료한다." }
    ]
  },
  {
    id: "m_bug_signup",
    title: "[버그 탐지] 잘못된 이메일인데 성공 메시지",
    difficulty: "초급",
    type: "bug_hunt",
    points: 130,
    summary: "이메일에 @가 없는데도 성공 토스트가 뜨는 결함을 재현합니다.",
    description: `회원가입 폼에서 **@ 없는 이메일**을 넣고 제출해 보세요. 정상이라면 오류여야 하는데, 이 데모에서는 **성공 메시지가 잘못 뜨는 버그**가 심어져 있습니다.\n\n재현 후 **에러 제보**에 입력값·기대 결과·실제 결과를 적어 보세요.`,
    prerequisites: [],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "signup"]
    },
    objectives: [{ id: "o1", checkId: "signup_invalid_bug", text: "@ 없는 이메일로 제출해도 성공 메시지가 뜨는 것을 확인한다." }]
  },
  {
    id: "m_bug_cta",
    title: "[버그 탐지] 체험하기 버튼 한 번에 안 넘어감",
    difficulty: "입문",
    type: "bug_hunt",
    points: 90,
    summary: "히어로 체험하기 버튼이 한 번에 동작하지 않을 수 있습니다.",
    description: `랜딩 히어로의 **체험하기**를 눌러 회원가입/로그인 쪽으로 가야 하는데, 첫 클릭에서 경고만 뜨고 이동하지 않을 수 있습니다.\n\n**신뢰성·일관성** 측면에서 어떤 문제인지 생각해 보고, 제보에 남겨 보세요.`,
    prerequisites: [],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "signup", "login"]
    },
    objectives: [{ id: "o1", checkId: "flaky_cta_observed", text: "체험하기 첫 클릭에서 경고 토스트가 뜨는 것을 확인한다." }]
  },
  {
    id: "m_login",
    title: "로그인하기",
    difficulty: "입문",
    type: "success",
    points: 100,
    summary: "회원가입 미션에서 만든 계정으로 로그인합니다. (없으면 안내 계정)",
    description: `이 미션에서는 **회원가입 화면을 사용할 수 없습니다.** 이미 가입한 사용자만 로그인할 수 있어야 한다는 전제를 연습합니다.\n\n먼저 **회원가입** 미션을 클리어했다면 저장된 이메일과 비밀번호 **password123**으로 로그인하세요. 가입 기록이 없으면 안내에 나온 **데모 계정**을 사용합니다.`,
    prerequisites: [],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "login"],
      seedDemoUser: { email: "demo@qa.test", name: "데모", password: "password123" }
    },
    objectives: [{ id: "o1", checkId: "login_completed", text: "로그인에 성공한다." }]
  },
  {
    id: "m_post_create",
    title: "게시글 작성",
    difficulty: "초급",
    type: "success",
    points: 110,
    summary: "로그인한 상태에서 게시판에 새 글을 등록합니다.",
    description: `로그인이 된 상태에서 **게시판**으로 가 **새 글 작성**을 누르고, 제목과 본문을 입력해 등록합니다.\n\n등록 후 목록에 보이는지, 본문 일부가 잘리지 않는지 등을 습관처럼 확인해 보세요.`,
    prerequisites: ["m_login"],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "board", "login"],
      preLoginSession: { email: "writer@qa.test", name: "작성자연습" },
      seedUsers: [{ email: "writer@qa.test", name: "작성자연습", password: "password123" }]
    },
    objectives: [{ id: "o1", checkId: "post_created", text: "새 게시글을 한 편 작성한다." }]
  },
  {
    id: "m_post_edit_delete",
    title: "게시글 수정 후 삭제",
    difficulty: "초급",
    type: "success",
    points: 140,
    summary: "내가 쓴 글을 수정한 뒤, 삭제까지 진행합니다.",
    description: `이미 **내 글**이 하나 있는 상태에서 시작합니다. 글을 연 뒤 **수정**으로 제목 또는 본문을 바꾸고 저장합니다. 그다음 **삭제**로 글이 목록에서 사라지는지 확인합니다.\n\n순서가 바뀌면 검증이 어려워질 수 있어, **먼저 수정 → 삭제** 순서를 권장합니다.`,
    prerequisites: ["m_login", "m_post_create"],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "board", "post", "login"],
      preLoginSession: { email: "writer@qa.test", name: "작성자연습" },
      seedUsers: [{ email: "writer@qa.test", name: "작성자연습", password: "password123" }],
      seedPosts: [
        {
          id: "seed-1",
          title: "수정·삭제 연습용 글",
          body: "이 글을 수정한 뒤 삭제해 보세요.",
          authorEmail: "writer@qa.test"
        }
      ]
    },
    objectives: [
      { id: "o1", checkId: "post_edited", text: "게시글을 수정하고 저장한다." },
      { id: "o2", checkId: "post_deleted", text: "같은 글을 삭제한다." }
    ]
  },
  {
    id: "m_comment",
    title: "댓글 작성",
    difficulty: "초급",
    type: "success",
    points: 100,
    summary: "게시글에 댓글을 남깁니다.",
    description: `로그인 상태에서 게시글을 연 뒤 댓글 입력란에 내용을 적고 **댓글 등록**을 누릅니다.\n\n빈 댓글, 길이 제한, XSS에 가까운 입력 등은 실무에서 추가 테스트 주제가 됩니다.`,
    prerequisites: ["m_login"],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "board", "post", "login"],
      preLoginSession: { email: "writer@qa.test", name: "작성자연습" },
      seedUsers: [{ email: "writer@qa.test", name: "작성자연습", password: "password123" }],
      seedPosts: [
        {
          id: "seed-c1",
          title: "댓글 연습 글",
          body: "아래에 댓글을 달아 보세요.",
          authorEmail: "writer@qa.test"
        }
      ]
    },
    objectives: [{ id: "o1", checkId: "comment_added", text: "댓글을 한 개 이상 등록한다." }]
  },
  {
    id: "m_comment_edit_delete",
    title: "댓글 수정·삭제",
    difficulty: "중급",
    type: "success",
    points: 130,
    summary: "내 댓글을 수정했다가 삭제합니다.",
    description: `글에 **내가 쓴 댓글**이 미리 하나 있습니다. 내용을 수정한 뒤 저장하고, 이어서 삭제해 보세요.\n\n본인만 수정/삭제 가능 같은 권한 규칙은 실서비스에서 매우 중요합니다.`,
    prerequisites: ["m_login", "m_comment"],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "board", "post", "login"],
      preLoginSession: { email: "writer@qa.test", name: "작성자연습" },
      seedUsers: [{ email: "writer@qa.test", name: "작성자연습", password: "password123" }],
      seedPosts: [
        {
          id: "seed-c2",
          title: "댓글 수정·삭제 연습",
          body: "댓글 영역을 확인하세요.",
          authorEmail: "writer@qa.test"
        }
      ],
      seedComments: [
        {
          id: "sc-1",
          postId: "seed-c2",
          body: "이 댓글을 수정한 뒤 삭제하세요.",
          authorEmail: "writer@qa.test"
        }
      ]
    },
    objectives: [
      { id: "o1", checkId: "comment_edited", text: "내 댓글을 수정한다." },
      { id: "o2", checkId: "comment_deleted", text: "같은 댓글을 삭제한다." }
    ]
  },
  {
    id: "m_profile",
    title: "개인정보(프로필) 수정",
    difficulty: "초급",
    type: "success",
    points: 110,
    summary: "로그인 후 프로필에서 표시 이름을 바꿉니다.",
    description: `**프로필** 화면에서 표시 이름을 수정하고 저장합니다.\n\n이메일은 식별용으로 잠겨 있을 수 있어, 실무에서는 변경 가능 필드·인증 재요구 여부를 스펙과 대조합니다.`,
    prerequisites: ["m_login"],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "board", "profile", "login"],
      preLoginSession: { email: "writer@qa.test", name: "작성자연습" },
      seedUsers: [{ email: "writer@qa.test", name: "작성자연습", password: "password123" }]
    },
    objectives: [{ id: "o1", checkId: "profile_updated", text: "프로필에서 이름을 수정하고 저장한다." }]
  },
  {
    id: "m_tour_public",
    title: "공개 화면 한 바퀴 (히어로)",
    difficulty: "입문",
    type: "success",
    points: 90,
    summary: "히어로 버튼만으로 문의·신청·플랜 화면을 모두 열어 봅니다.",
    description: `랜딩의 네 개 CTA 중 **문의하기 · 지금 신청하기 · 구매 플랜 조회**를 각각 눌러 해당 화면으로 이동하는지 확인합니다.\n\n실무에서는 같은 랜딩에서 나가는 링크가 서로 다른 탭 정책·UTM·권한을 쓰는지도 함께 봅니다.`,
    prerequisites: [],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "contact", "apply", "plans"]
    },
    objectives: [
      { id: "o1", checkId: "visited_contact", text: "문의하기 화면에 들어간다." },
      { id: "o2", checkId: "visited_apply", text: "신청 화면에 들어간다." },
      { id: "o3", checkId: "visited_plans", text: "플랜 비교 화면에 들어간다." }
    ]
  },
  {
    id: "m_dual_forms",
    title: "문의 + 신청 한 세션에 제출",
    difficulty: "입문",
    type: "success",
    points: 100,
    summary: "같은 미션 안에서 문의 폼과 신청 폼을 모두 제출합니다.",
    description: `먼저 **문의하기**에서 제목·내용을 넣고 보낸 뒤, **지금 신청하기**에서 이름·이메일 등을 채워 신청까지 완료합니다.\n\n두 폼이 서로 상태를 덮어쓰지 않는지, 각각 토스트·유효성이 독립적인지 확인하는 연습입니다.`,
    prerequisites: [],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "contact", "apply"]
    },
    objectives: [
      { id: "o1", checkId: "submitted_contact_form", text: "문의 폼을 제출한다." },
      { id: "o2", checkId: "submitted_apply_form", text: "신청 폼을 제출한다." }
    ]
  },
  {
    id: "m_login_retry",
    title: "로그인 · 실패 한 번 후 성공",
    difficulty: "초급",
    type: "success",
    points: 110,
    summary: "의도적으로 틀린 비밀번호로 한 번 막힌 뒤, 올바르게 로그인합니다.",
    description: `**로그인** 화면에서 데모 계정 이메일은 맞추고 비밀번호만 틀리게 넣어 **오류 메시지**를 확인합니다. 그다음 **password123**으로 다시 로그인해 성공합니다.\n\n실패·성공 시 메시지·포커스·잠금 정책은 보안·UX 테스트의 단골 주제입니다.`,
    prerequisites: [],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "login"],
      seedDemoUser: { email: "demo@qa.test", name: "데모", password: "password123" }
    },
    objectives: [
      { id: "o1", checkId: "login_failed_once", text: "잘못된 비밀번호로 로그인에 실패한다." },
      { id: "o2", checkId: "login_completed", text: "올바른 비밀번호로 로그인에 성공한다." }
    ]
  },
  {
    id: "m_session_logout",
    title: "로그인 후 로그아웃",
    difficulty: "입문",
    type: "success",
    points: 95,
    summary: "로그인한 뒤 로그아웃 버튼으로 세션을 끊습니다.",
    description: `데모 계정으로 로그인한 다음 상단 **로그아웃**을 눌러 랜딩으로 돌아오는지 확인합니다.\n\n로그아웃 후 뒤로 가기·캐시로 이전 화면이 보이는지 등은 별도 회귀 시나리오로 다루기도 합니다.`,
    prerequisites: [],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "login"],
      seedDemoUser: { email: "demo@qa.test", name: "데모", password: "password123" }
    },
    objectives: [
      { id: "o1", checkId: "session_had_login", text: "로그인에 성공한다." },
      { id: "o2", checkId: "logout_done", text: "로그아웃을 실행한다." }
    ]
  },
  {
    id: "m_board_browse",
    title: "게시판 목록 · 글 상세 열기",
    difficulty: "입문",
    type: "success",
    points: 85,
    summary: "게시판에 들어가 목록에서 글 하나를 열어 본문을 확인합니다.",
    description: `로그인된 상태에서 **게시판**으로 이동한 뒤, 목록의 제목을 눌러 **글 상세**로 들어갑니다.\n\n목록과 상세의 제목·작성자·본문 일치, 빈 목록·삭제된 글 처리 등을 떠올려 보세요.`,
    prerequisites: ["m_login"],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "board", "post", "login"],
      preLoginSession: { email: "writer@qa.test", name: "작성자연습" },
      seedUsers: [{ email: "writer@qa.test", name: "작성자연습", password: "password123" }],
      seedPosts: [
        {
          id: "seed-browse",
          title: "목록에서 이 글을 열어 보세요",
          body: "상세 화면이 열리면 미션 목표가 채워집니다.",
          authorEmail: "writer@qa.test"
        }
      ]
    },
    objectives: [
      { id: "o1", checkId: "visited_board", text: "게시판 화면에 진입한다." },
      { id: "o2", checkId: "visited_post", text: "목록에서 글을 열어 상세 화면으로 간다." }
    ]
  },
  {
    id: "m_signup_password_rule",
    title: "회원가입 · 비밀번호 규칙 후 정상 가입",
    difficulty: "초급",
    type: "success",
    points: 115,
    summary: "8자 미만 비밀번호는 거절되는지 확인한 뒤, 규칙에 맞게 가입을 마칩니다.",
    description: `회원가입 화면에서 이메일은 유효하게 두고 비밀번호만 **7자 이하**로 넣어 제출해 **거절**되는지 봅니다. 이후 **8자 이상**으로 바꿔 가입을 완료합니다.\n\n메시지 문구·포커스·필드 초기화 여부까지 기록하면 버그 리포트 품질이 올라갑니다.`,
    prerequisites: [],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "signup"]
    },
    objectives: [
      { id: "o1", checkId: "signup_rejected_short_password", text: "짧은 비밀번호로 제출 시 거절(오류)됨을 확인한다." },
      { id: "o2", checkId: "signup_completed_valid", text: "규칙에 맞는 비밀번호로 가입을 완료한다." }
    ]
  },
  {
    id: "m_repeat_inquiry",
    title: "문의 폼 · 연속 제출",
    difficulty: "입문",
    type: "success",
    points: 75,
    summary: "문의하기에서 제출을 두 번 수행해 봅니다.",
    description: `**문의하기** 화면에서 첫 번째 문의를 보낸 뒤, 제목·내용을 다시 입력하고 **한 번 더** 제출합니다.\n\n실서비스에서는 중복 클릭 방지·로딩·이중 등록 방지 등이 붙는 경우가 많습니다. 여기서는 토스트가 두 번 뜨는지만 확인해 봅니다.`,
    prerequisites: [],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "contact"]
    },
    objectives: [{ id: "o1", checkId: "contact_submit_twice", text: "문의 폼을 두 번 제출한다." }]
  },
  {
    id: "m_bug_contact_empty",
    title: "[버그 탐지] 빈 문의 폼도 제출 성공",
    difficulty: "초급",
    type: "bug_hunt",
    points: 100,
    summary: "제목·내용 없이 보내도 성공 토스트가 뜨는 결함을 재현합니다.",
    description: `이 미션에서는 문의 필드의 **필수 검증이 꺼진 것처럼** 동작합니다. 아무 것도 입력하지 않고 **문의 보내기**를 눌러 보세요.\n\n정상이라면 전송 전에 막혀야 합니다. 기대 vs 실제를 짧게 적어 보세요.`,
    prerequisites: [],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "contact"],
      bugAcceptEmptyContact: true
    },
    objectives: [
      { id: "o1", checkId: "contact_empty_submit_bug", text: "내용 없이 제출해도 성공 처리되는 버그를 확인한다." }
    ]
  },
  {
    id: "m_bug_apply_empty",
    title: "[버그 탐지] 빈 신청 폼도 제출 성공",
    difficulty: "초급",
    type: "bug_hunt",
    points: 100,
    summary: "이름·이메일 없이 신청해도 접수되는 결함을 재현합니다.",
    description: `신청 폼에서 **이름·이메일·요청**을 모두 비운 채 **신청 보내기**를 눌러 봅니다.\n\n서버·클라이언트 검증이 빠진 경우를 가정한 시나리오입니다.`,
    prerequisites: [],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "apply"],
      bugAcceptEmptyApply: true
    },
    objectives: [
      { id: "o1", checkId: "apply_empty_submit_bug", text: "필수값 없이 제출해도 성공하는 버그를 확인한다." }
    ]
  },
  {
    id: "m_bug_hero_plans_wrong",
    title: "[버그 탐지] 히어로 「플랜」이 문의로 연결",
    difficulty: "초급",
    type: "bug_hunt",
    points: 95,
    summary: "랜딩 히어로의 구매 플랜 버튼이 플랜이 아닌 문의 화면으로 갑니다.",
    description: `**구매 플랜 조회** 히어로 버튼을 눌렀을 때 **문의하기** 화면이 열리면 버그입니다. 상단 메뉴의 플랜과 비교해 기록해 보세요.`,
    prerequisites: [],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "contact", "plans"],
      bugHeroPlansToContact: true
    },
    objectives: [
      { id: "o1", checkId: "wrong_hero_plans_nav", text: "히어로 플랜 버튼이 잘못된 화면(문의)으로 이어짐을 확인한다." }
    ]
  },
  {
    id: "m_bug_login_false_success",
    title: "[버그 탐지] 로그인 실패인데 성공 토스트",
    difficulty: "초급",
    type: "bug_hunt",
    points: 105,
    summary: "잘못된 비밀번호인데도 「로그인되었습니다」 메시지가 뜹니다.",
    description: `데모 계정 **demo@qa.test**에 **틀린 비밀번호**를 넣고 로그인해 보세요. 상단 세션은 여전히 비로그인인데 성공 토스트만 뜨는지 확인합니다.`,
    prerequisites: [],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "login"],
      seedDemoUser: { email: "demo@qa.test", name: "데모", password: "password123" },
      bugLoginFalseSuccess: true
    },
    objectives: [
      { id: "o1", checkId: "login_false_success_bug", text: "실패 상황인데 성공 토스트가 뜨는 버그를 확인한다." }
    ]
  },
  {
    id: "m_bug_hero_apply_wrong",
    title: "[버그 탐지] 히어로 「신청」이 플랜 화면으로 연결",
    difficulty: "초급",
    type: "bug_hunt",
    points: 95,
    summary: "지금 신청하기 버튼이 신청이 아닌 플랜 비교로 잘못 연결됩니다.",
    description: `히어로 **지금 신청하기**를 눌렀을 때 **구매 플랜 조회**가 열리면 경로 버그입니다.`,
    prerequisites: [],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "apply", "plans"],
      bugHeroApplyToPlans: true
    },
    objectives: [
      { id: "o1", checkId: "wrong_hero_apply_nav", text: "히어로 신청 버튼이 잘못된 화면(플랜)으로 이어짐을 확인한다." }
    ]
  },
  {
    id: "m_bug_board_empty_list",
    title: "[버그 탐지] 글이 있는데 게시판 목록이 비어 있음",
    difficulty: "초급",
    type: "bug_hunt",
    points: 100,
    summary: "서버에는 글이 있는데 목록만 비어 보이는 결함을 확인합니다.",
    description: `게시판으로 들어가면 **목록이 비어 있다**고 나오지만, 이 미션에는 실제로는 글이 있습니다. 빈 목록이 표시되는지 확인합니다.`,
    prerequisites: ["m_login"],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "board", "login"],
      bugBoardEmptyList: true,
      preLoginSession: { email: "writer@qa.test", name: "작성자연습" },
      seedUsers: [{ email: "writer@qa.test", name: "작성자연습", password: "password123" }],
      seedPosts: [
        {
          id: "seed-bug-empty",
          title: "목록에 안 보이는 글",
          body: "데이터는 있는데 UI만 비어 있는 버그 시나리오입니다.",
          authorEmail: "writer@qa.test"
        }
      ]
    },
    objectives: [
      { id: "o1", checkId: "board_empty_while_posts_bug", text: "게시글이 있음에도 목록이 비어 있음을 확인한다." }
    ]
  },
  {
    id: "m_bug_post_wrong_author",
    title: "[버그 탐지] 글 상세 작성자 표시 오류",
    difficulty: "초급",
    type: "bug_hunt",
    points: 95,
    summary: "상세 화면의 작성자가 실제 작성자와 다르게 표시됩니다.",
    description: `목록에서 글을 열고 **작성자** 줄이 실제 이메일과 다른지 확인합니다.`,
    prerequisites: ["m_login"],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "board", "post", "login"],
      bugWrongPostAuthor: true,
      preLoginSession: { email: "writer@qa.test", name: "작성자연습" },
      seedUsers: [{ email: "writer@qa.test", name: "작성자연습", password: "password123" }],
      seedPosts: [
        {
          id: "seed-wrong-author",
          title: "작성자 표시 확인용 글",
          body: "작성자 메타가 본문과 일치하는지 봅니다.",
          authorEmail: "writer@qa.test"
        }
      ]
    },
    objectives: [
      { id: "o1", checkId: "wrong_author_on_post_bug", text: "상세에서 작성자가 잘못 표시됨을 확인한다." }
    ]
  },
  {
    id: "m_bug_comment_double_submit",
    title: "[버그 탐지] 댓글 한 번 등록에 두 줄 생김",
    difficulty: "초급",
    type: "bug_hunt",
    points: 110,
    summary: "댓글을 한 번 보냈는데 목록에 중복으로 쌓입니다.",
    description: `글을 연 뒤 댓글을 **한 번만** 제출해 보세요. **두 개**가 생기면 이중 등록 버그입니다.`,
    prerequisites: ["m_login"],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "board", "post", "login"],
      bugCommentDoublePost: true,
      preLoginSession: { email: "writer@qa.test", name: "작성자연습" },
      seedUsers: [{ email: "writer@qa.test", name: "작성자연습", password: "password123" }],
      seedPosts: [
        {
          id: "seed-dbl-cmt",
          title: "댓글 중복 등록 연습",
          body: "댓글 하나만 달아 보세요.",
          authorEmail: "writer@qa.test"
        }
      ]
    },
    objectives: [
      { id: "o1", checkId: "comment_double_submit_bug", text: "한 번 제출로 댓글이 두 번 생기는 버그를 확인한다." }
    ]
  },
  {
    id: "m_bug_profile_fake_save",
    title: "[버그 탐지] 프로필 저장이 반영되지 않음",
    difficulty: "초급",
    type: "bug_hunt",
    points: 100,
    summary: "저장 성공 메시지는 뜨는데 이름이 그대로인 결함입니다.",
    description: `프로필에서 표시 이름을 바꾸고 **저장**을 누릅니다. 토스트는 성공인데 값이 안 바뀌면 버그입니다.`,
    prerequisites: ["m_login"],
    sandbox: {
      reset: true,
      allowedRoutes: ["landing", "board", "profile", "login"],
      bugProfileFakeSave: true,
      preLoginSession: { email: "writer@qa.test", name: "작성자연습" },
      seedUsers: [{ email: "writer@qa.test", name: "작성자연습", password: "password123" }]
    },
    objectives: [
      { id: "o1", checkId: "profile_fake_save_bug", text: "저장 성공만 뜨고 실제 반영이 없음을 확인한다." }
    ]
  }
];

/**
 * 같은 UI·기능을 두고 시나리오만 나눈 미션 묶음. hubMissionId로 들어가면 하위 미션 목록(허브)을 연다.
 * 개별 미션 상세는 mission.html?m=ID&d=1
 */
const missionFeatureGroups = [
  {
    hubMissionId: "m_inquiry",
    title: "문의하기 기능",
    summary: "문의 폼만 두고 정상 제출·연속 제출 등 시나리오를 나눕니다.",
    intro:
      "같은 **문의하기** 화면에서 목표만 달라집니다. 성공 플로우와 연속 제출·중복 제출 관점을 각각 연습합니다.",
    missionIds: ["m_inquiry", "m_repeat_inquiry", "m_bug_contact_empty"]
  },
  {
    hubMissionId: "m_apply",
    title: "신청하기 기능",
    summary: "신청 폼 단독 제출과, 같은 세션에서 문의+신청을 함께 다루는 흐름입니다.",
    intro:
      "**지금 신청하기** 화면과 **문의+신청** 복합 플로우를 한 묶음에서 비교해 봅니다. 폼이 서로 간섭하지 않는지도 확인합니다.",
    missionIds: ["m_apply", "m_dual_forms", "m_bug_apply_empty"]
  },
  {
    hubMissionId: "m_plans",
    title: "구매 플랜·메뉴",
    summary: "플랜 비교 화면 진입과, 상단 메뉴/히어로 경로가 어긋나는 버그 탐지를 묶었습니다.",
    intro:
      "플랜 카드 UI를 보는 **성공 시나리오**와, 같은 이름의 메뉴가 서로 다른 화면으로 가는 **버그 탐지**를 함께 둡니다.",
    missionIds: ["m_plans", "m_bug_nav", "m_bug_hero_plans_wrong"]
  },
  {
    hubMissionId: "m_signup",
    title: "회원가입 기능",
    summary: "정상 가입, 잘못된 이메일 버그, 비밀번호 규칙, 히어로 체험하기 동작까지 가입 주변 시나리오입니다.",
    intro:
      "**회원가입** 화면과 이어지는 **체험하기** CTA를 기준으로, 성공·실패·결함 재현·유효성 검증을 한데 모았습니다.",
    missionIds: ["m_signup", "m_bug_signup", "m_signup_password_rule", "m_bug_cta"]
  },
  {
    hubMissionId: "m_login",
    title: "로그인·세션",
    summary: "로그인 성공, 실패 후 재시도, 로그아웃까지 세션 관련 흐름입니다.",
    intro:
      "같은 **로그인** UI에서 한 번에 성공하는 경우와, 실패 메시지 확인 후 재시도하는 경우, 로그아웃까지 나눕니다.",
    missionIds: ["m_login", "m_login_retry", "m_session_logout", "m_bug_login_false_success"]
  },
  {
    hubMissionId: "m_tour_public",
    title: "랜딩·히어로 탐색",
    summary: "비로그인 랜딩에서 히어로 버튼만으로 문의·신청·플랜 화면을 순회합니다.",
    intro:
      "한 미션 안에서 공개 화면 **한 바퀴**를 돕니다. CTA별 도착 화면이 기대와 맞는지 익숙해지는 연습입니다.",
    missionIds: ["m_tour_public", "m_bug_hero_apply_wrong"]
  },
  {
    hubMissionId: "m_board_browse",
    title: "게시판 · 글",
    summary: "목록·상세 열람, 새 글 작성, 수정 후 삭제까지 글 중심 시나리오입니다.",
    intro:
      "**게시판**과 **글 상세**를 공유합니다. 읽기 전용 탐색부터 작성·수정·삭제까지 순서가 다른 미션들입니다.",
    missionIds: ["m_board_browse", "m_post_create", "m_post_edit_delete", "m_bug_board_empty_list", "m_bug_post_wrong_author"]
  },
  {
    hubMissionId: "m_comment",
    title: "게시판 · 댓글",
    summary: "댓글 등록과, 내 댓글 수정·삭제를 각각 연습합니다.",
    intro:
      "같은 **글 상세** 맥락에서 댓글만 목표가 달라집니다. 선행 미션(로그인·댓글 작성)은 각 시나리오에 맞게 잠깁니다.",
    missionIds: ["m_comment", "m_comment_edit_delete", "m_bug_comment_double_submit"]
  },
  {
    hubMissionId: "m_profile",
    title: "프로필 기능",
    summary: "로그인 후 표시 이름 등 프로필 수정 플로우입니다.",
    intro:
      "**프로필** 화면에서 저장 가능한 필드와 피드백을 확인합니다. 성공 저장과 **저장처럼 보이나 반영 안 됨** 버그를 함께 둡니다.",
    missionIds: ["m_profile", "m_bug_profile_fake_save"]
  }
];

function getMissionById(id) {
  return missions.find((m) => m.id === id) || null;
}

function isMissionUnlocked(mission, completedIds) {
  if (!mission.prerequisites?.length) return true;
  return mission.prerequisites.every((req) => completedIds.includes(req));
}

/** 선행 미션 ID 중 아직 완료되지 않은 첫 항목 (없으면 null) */
function firstIncompletePrerequisiteId(mission, completedIds) {
  if (!mission?.prerequisites?.length) return null;
  const done = completedIds || [];
  for (const id of mission.prerequisites) {
    if (!done.includes(id)) return id;
  }
  return null;
}

function getFeatureGroupByHubId(hubMissionId) {
  return missionFeatureGroups.find((g) => g.hubMissionId === hubMissionId) || null;
}

function getGroupedMissionIdsSet() {
  const s = new Set();
  missionFeatureGroups.forEach((g) => {
    g.missionIds.forEach((id) => s.add(id));
  });
  return s;
}

(function validateMissionFeatureGroups() {
  const allIds = new Set(missions.map((m) => m.id));
  const covered = new Set();
  for (const g of missionFeatureGroups) {
    if (!allIds.has(g.hubMissionId)) {
      throw new Error(`[missions] hubMissionId가 정의되지 않은 미션입니다: ${g.hubMissionId}`);
    }
    if (!g.missionIds.includes(g.hubMissionId)) {
      throw new Error(`[missions] hubMissionId는 해당 묶음 missionIds에 포함되어야 합니다: ${g.hubMissionId}`);
    }
    for (const id of g.missionIds) {
      if (!allIds.has(id)) {
        throw new Error(`[missions] 기능 묶음에 없는 mission id: ${id}`);
      }
      if (covered.has(id)) {
        throw new Error(`[missions] 미션이 두 묶음에 중복되었습니다: ${id}`);
      }
      covered.add(id);
    }
  }
  const missing = missions.map((m) => m.id).filter((id) => !covered.has(id));
  if (missing.length) {
    throw new Error(`[missions] 기능 묶음에 빠진 미션: ${missing.join(", ")}`);
  }
})();

window.QA = window.QA || {};
window.QA.missions = missions;
window.QA.missionFeatureGroups = missionFeatureGroups;
window.QA.getMissionById = getMissionById;
window.QA.isMissionUnlocked = isMissionUnlocked;
window.QA.firstIncompletePrerequisiteId = firstIncompletePrerequisiteId;
window.QA.getFeatureGroupByHubId = getFeatureGroupByHubId;
window.QA.getGroupedMissionIdsSet = getGroupedMissionIdsSet;
