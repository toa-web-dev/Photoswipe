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

                //시간이 지나서 버튼이 활성화되는 것이아니라
                // currentCard의 다음 카드(previousSibling)이 이미지 렌더가 완료 되었을때 활성화하기
                throttleTimer = setTimeout(() => {
                    throttleTimer = null;
                    $btnLike.classList.replace("deactive", "active");
                    $btnDislike.classList.replace("deactive", "active");
                }, 1000);
            }
        };
    };
    const InitData = async () => {
        targetArr = await getCardDataFromId(cardIdArr); //[0,1,2,3,4]
        for (let i = targetArr.length - 1; i >= 0; i--) {
            $cardContainer.appendChild(Item(targetArr[i]));
        }
        $currentCard = $cardContainer.querySelector(".card:last-child");
        cardIdArr = cardIdArr.map((el) => el + RENDER_CARD_NUM);
        bufferArr = await getCardDataFromId(cardIdArr);
    };
    const InsertCard = async (curCardId) => {
        try {
            const renderItem = bufferArr.filter((el) => el.id === curCardId + RENDER_CARD_NUM)[0];
            $cardContainer.insertBefore(Item(renderItem), $cardContainer.firstElementChild);
            if (curCardId === targetArr.at(-1).id) {
                targetArr = bufferArr;
                cardIdArr = cardIdArr.map((el) => el + RENDER_CARD_NUM);
                bufferArr = await getCardDataFromId(cardIdArr);
            }
        } catch (e) {
            console.log("카드 추가 실패, 카드 추가 재시도...", e);
            setTimeout(() => {
                InsertCard(curCardId);
            }, 500);
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
            console.log("카드 제거 중 오류 발생", e);
        }
    };
    const Swipe = (preference) => {
        const curCardId = parseInt($currentCard.id);
        InsertCard(curCardId);
        RemoveCard(preference);
    };
    InitBtn();
    InitData();
}
app();
