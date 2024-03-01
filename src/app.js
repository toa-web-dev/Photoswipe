import { Item } from "./components/Item.js";
const URL = import.meta.env.VITE_URL;
const RENDER_CARD_NUM = 5;
const THROTTLE_DELAY_MS = 200;

/**
 * 
작성한 코드는 이미 잘 구조화되어 있지만 몇 가지 개선점이 있을 수 있습니다:

코드 주석 추가: 코드에 주석을 추가하여 각 함수의 역할이나 코드 블록의 목적을 설명하는 것이 좋습니다. 특히 코드가 복잡하거나 이해하기 어려운 경우 주석을 추가하여 코드를 이해하기 쉽게 해야 합니다.

함수명 및 변수명 개선: 함수와 변수의 이름이 명확하고 의미에 맞게 지어져 있는지 확인해야 합니다. 변수와 함수의 이름은 해당 요소의 역할을 잘 설명해야 합니다.

재사용성 고려: 현재 코드는 InitPointerEvent 함수가 다음 카드를 초기화하고, 카드를 삽입하고, 포인터 이벤트를 설정하는 등 다양한 작업을 수행합니다. 이러한 다양한 작업은 서로 관련 없는 역할이므로 함수를 분리하여 단일 책임 원칙에 따라 더 재사용성이 높은 코드로 만들 수 있습니다.

상수 및 설정 분리: 코드에서 사용되는 상수나 설정 값들을 상수로 정의하고 분리하는 것이 좋습니다. 이렇게 하면 코드의 가독성을 높이고 유지 보수성을 향상시킬 수 있습니다.

모듈화: 코드를 여러 모듈로 분리하여 각 모듈이 특정 기능을 담당하도록 구성하는 것이 좋습니다. 이렇게 하면 코드를 관리하기 쉽고 재사용성을 높일 수 있습니다.

이러한 개선점들을 고려하여 코드를 개선하면 보다 효율적이고 유지보수가 쉬운 코드를 만들 수 있습니다.
  
 */

let $cardContainer = document.querySelector("#card_container"); // RENDER_CARD_NUM의 수 만큼의 카드를 보관
let $currentCard; // $cardContainer에서 사용자가 조작하는 맨 앞에 위치한 카드
let $figcap; //사진 카드 위에 표시되는 호불호를 표시하는 텍스트를 담는 부모 요소
let cardId = 0; // 이미지를 요청하는 외부 API에서 사용되는 id값
let startPoint = {}, // 카드의 움직임에 사용되는 좌표 x와 y값이 할당되는 변수
    distance = {};

function app() {
    InitBtn();
    InitCard();
    InitPointerEvent();
}

const createNewCard = () => {
    const $item = Item(cardId);
    $item.style.backgroundImage = `url("${URL}?random=${cardId}")`;
    cardId++;
    return $item;
};

const insertCard = () => {
    try {
        $cardContainer.insertBefore(createNewCard(), $cardContainer.firstElementChild);
    } catch (e) {
        console.log("카드 추가 실패, 카드 추가 재시도...", e);
        setTimeout(() => {
            insertCard();
        }, 500);
    }
};

const RemoveCard = (preference) => {
    try {
        let flyX, flyY;
        let deg;
        const direction = preference === "like" ? 1 : -1;
        if (Object.keys(distance).length === 0) {
            // 버튼을 눌러서 포인터 이벤트에서 할당되는 distance의 값이 없는 경우
            flyX = direction * (innerWidth / 2 + $currentCard.offsetWidth);
            flyY = 0;
            deg = direction * 30;
        } else {
            const slope = distance.y / distance.x;
            flyX = (Math.abs(distance.x) / distance.x) * (innerWidth / 2 + $currentCard.offsetWidth);
            flyY = slope * flyX;
            deg = (distance.x / innerWidth) * 100;
        }
        set$currentCardTransform(flyX, flyY, deg, innerWidth * 0.5);
    } catch (e) {
        console.log("카드 제거 중 오류 발생", e);
    }
};

const swipe = (preference) => {
    insertCard();
    RemoveCard(preference);

    // 다음 카드를 $currentCard에 할당
    const $prevCard = $currentCard;
    $currentCard = $currentCard.previousElementSibling;
    const RemoveSwipedCard = () => {
        $cardContainer.removeChild($prevCard);
        $prevCard.removeEventListener("transitionend", RemoveSwipedCard);
    };
    $prevCard.addEventListener("transitionend", RemoveSwipedCard);
    startPoint = {};
    distance = {};

    InitPointerEvent();
};

const set$currentCardTransform = (x = 0, y = 0, deg = 0, duration = null) => {
    $currentCard.style.transform = `translate(${x}px,${y}px) rotate(${deg}deg)`;
    if (duration) {
        $currentCard.style.transition = `transform ${duration}ms ease-in`;
        setTimeout(() => {
            $currentCard.style.transition = ``;
        }, duration);
    }
};

const InitBtn = () => {
    let throttlingTimerID = null;
    const $btnLike = document.querySelector('[data-btn-preference="like"]');
    const $btnDislike = document.querySelector('[data-btn-preference="dislike"]');
    $btnLike.classList.add("active");
    $btnDislike.classList.add("active");

    const btnHandler = (e) => {
        $figcap = $currentCard.querySelector("figcaption");
        const preference = e.target.dataset.btnPreference;
        if (!throttlingTimerID) {
            $figcap.classList.add(preference);
            $figcap.style.opacity = 1;
            swipe(preference);
            btnThorttle();
        }
    };

    $btnLike.onclick = btnHandler;
    $btnDislike.onclick = btnHandler;

    const btnThorttle = () => {
        $btnLike.classList.replace("active", "deactive");
        $btnDislike.classList.replace("active", "deactive");
        throttlingTimerID = setTimeout(() => {
            throttlingTimerID = null;
            $btnLike.classList.replace("deactive", "active");
            $btnDislike.classList.replace("deactive", "active");
        }, THROTTLE_DELAY_MS);
    };
};

const InitCard = () => {
    for (let i = 0; i < RENDER_CARD_NUM; i++) {
        $cardContainer.insertBefore(createNewCard(), $cardContainer.firstElementChild);
    }
    $currentCard = $cardContainer.lastElementChild;
};

const InitPointerEvent = () => {
    const pointerDown = (e) => {
        startPoint = { x: parseInt(e.clientX), y: parseInt(e.clientY) };
        $currentCard.addEventListener("pointermove", pointerMove);
        $currentCard.addEventListener("pointerup", pointerUp);
        $currentCard.addEventListener("pointerleave", pointerLeave);
    };
    const pointerMove = (e) => {
        distance = {
            x: parseInt(e.clientX) - startPoint.x,
            y: parseInt(e.clientY) - startPoint.y,
        };
        const $figcap = $currentCard.querySelector("figcaption");
        if (distance.x !== 0) {
            if (distance.x > 0) {
                $figcap.className = "like";
            } else {
                $figcap.className = "dislike";
            }
            $figcap.style.opacity = (Math.abs(distance.x) / ($currentCard.offsetWidth / 2)) * 0.4;
        } else {
            $figcap.className = "";
        }
        set$currentCardTransform(distance.x, distance.y, (distance.x / innerWidth) * 100);
    };
    const pointerLeave = () => {
        pointerUp();
    };
    const pointerUp = () => {
        InitPointerEvent();
        if ($cardContainer.clientWidth / 2 < Math.abs(distance.x)) {
            const preference = distance.x > 0 ? "like" : "dislike";
            swipe(preference);
        } else {
            $currentCard.querySelector("figcaption").className = "";
            set$currentCardTransform(0, 0, 0, 100);
        }
    };

    $currentCard.addEventListener("pointerdown", pointerDown);
    $currentCard.removeEventListener("pointermove", pointerMove);
    $currentCard.removeEventListener("pointerup", pointerUp);
    $currentCard.removeEventListener("pointerleave", pointerLeave);
};

app();
