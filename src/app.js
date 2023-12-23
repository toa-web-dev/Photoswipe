import { getCardDataFromId } from "./util/fetch.js";
import { Item } from "./components/Item.js";

const RENDER_CARD_NUM = 5;

function app() {
    let $cardContainer = document.querySelector("#card_container");
    let $currentCard;
    let cardIdArr = Array.from({ length: RENDER_CARD_NUM }).map((_, index) => index);
    let targetArr = [];
    let bufferArr = [];

    const InitBtn = () => {
        let throttleTimer = null;
        const $btnLike = document.querySelector('[data-btn-preference="like"]');
        const $btnDislike = document.querySelector('[data-btn-preference="dislike"]');
        $btnLike.classList.add("active");
        $btnDislike.classList.add("active");
        $btnLike.onclick = (e) => {
            const preference = e.target.dataset.btnPreference;
            thorttle(() => Swipe(preference));
        };
        $btnDislike.onclick = (e) => {
            const preference = e.target.dataset.btnPreference;
            thorttle(() => Swipe(preference));
        };
        const thorttle = (func) => {
            if (!throttleTimer) {
                func();
                $btnLike.classList.replace("active", "deactive");
                $btnDislike.classList.replace("active", "deactive");
                throttleTimer = setTimeout(() => {
                    throttleTimer = null;
                    $btnLike.classList.replace("deactive", "active");
                    $btnDislike.classList.replace("deactive", "active");
                }, 500);
            }
        };
    };
    const InitData = async () => {
        targetArr = await getCardDataFromId(cardIdArr); //[0,1,2,3,4]
        for (let i = targetArr.length - 1; i >= 0; i--) {
            $cardContainer.appendChild(Item(targetArr[i]));
        }
        $currentCard = $cardContainer.querySelector(".card:last-child");
        InitPointerEvent();
        cardIdArr = cardIdArr.map((el) => el + RENDER_CARD_NUM);
        bufferArr = await getCardDataFromId(cardIdArr);
    };
    const InsertCard = async () => {
        try {
            let curCardId = parseInt($currentCard.id);
            const renderItem = bufferArr.filter((el) => el.id === curCardId + RENDER_CARD_NUM)[0];
            $cardContainer.insertBefore(Item(renderItem), $cardContainer.firstElementChild);
            if (curCardId === targetArr.at(-1).id) {
                targetArr = bufferArr;
                cardIdArr = cardIdArr.map((el) => el + RENDER_CARD_NUM);
                bufferArr = await getCardDataFromId(cardIdArr);
            }
        } catch (e) {
            console.log("카드 추가 중 오류 발생", e);
        }
    };
    const RemoveCard = (preference) => {
        try {
            $currentCard.classList.add(`action_${preference}`);
            const $prevCard = $currentCard;
            $currentCard = $currentCard.previousElementSibling;
            const RemoveSwipedCard = () => {
                $cardContainer.removeChild($prevCard);
                $prevCard.removeEventListener("animationend", RemoveSwipedCard);
            };
            $prevCard.addEventListener("animationend", RemoveSwipedCard);
        } catch (e) {
            console.log("카드 추가 중 오류 발생", e);
        }
    };
    const Swipe = (preference) => {
        InsertCard();
        RemoveCard(preference);
    };
    InitBtn();
    InitData();

    const InitPointerEvent = () => {
        $currentCard.addEventListener("pointerdown", PointDownAction);
    };

    const PointDownAction = () => {
        $currentCard.addEventListener("pointermove", PointMoveAction);
        $currentCard.addEventListener("pointerup", PointUpAction);
        $currentCard.addEventListener("pointerleave", PointLeaveAction);
    };

    const PointMoveAction = (e) => {
        console.log("pointer move");
        const _x = parseInt(e.clientX);
        const _y = parseInt(e.clientY);
        $currentCard.style.position = "fixed";
        $currentCard.style.transform = `translate(calc(-50% + ${_x}px),calc(-50% + ${_y}px)`;
    };
    const PointLeaveAction = () => {
        console.log("pointer leave");
        $currentCard.style.position = "absolute";
        $currentCard.removeEventListener("pointermove", PointMoveAction);
    };
    const PointUpAction = () => {
        console.log("pointer up");
        $currentCard.style.position = "absolute";
        $currentCard.style.transform = `translate(0)`;
        $currentCard.removeEventListener("pointermove", PointMoveAction);
    };

    //카드가 넘어간 뒤 $currentCard에 다음 카드가 할당되었을 때 기존 이벤트리스너를 제거하고 새로 등록해야함

    const removeAction = () => {
        $currentCard.removeEventListener("pointerdown", PointDownAction);
        $currentCard.removeEventListener("pointermove", PointMoveAction);
        $currentCard.removeEventListener("pointerup", PointUpAction);
        $currentCard.removeEventListener("pointerleave", PointLeaveAction);
    };
}
app();
