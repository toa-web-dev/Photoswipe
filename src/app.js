import { getCardData } from "./util/fetch.js";
import { Item } from "./components/Item.js";
function app() {
    let $cardContainer = document.querySelector("#card_container");
    let $currentCard;
    let throttleTimer = null;
    let cardIdArr = [0, 1, 2, 3, 4];
    let currentCardDataArr = [],
        nextCardDataArr = [];
    let cardIdIndex = 0;

    const InitBtn = () => {
        const $btnLike = document.querySelector('[data-btn-preference="like"]');
        const $btnDislike = document.querySelector('[data-btn-preference="dislike"]');
        $btnLike.classList.add("active");
        $btnDislike.classList.add("active");

        const btnThorttle = (func) => {
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

        $btnLike.onclick = (e) => {
            btnThorttle(() => Swipe(e.target.dataset.btnPreference));
        };
        $btnDislike.onclick = (e) => {
            btnThorttle(() => Swipe(e.target.dataset.btnPreference));
        };
    };

    const InitData = async () => {
        currentCardDataArr = await getCardData(cardIdArr); //[0,1,2,3,4]
        for (let i = cardIdArr.length - 1; i >= 0; i--) {
            console.log(currentCardDataArr[i]);
            $cardContainer.appendChild(Item(currentCardDataArr[i]));
            cardIdIndex++;
        }
        cardIdArr = cardIdArr.map((el) => el + 5);
        nextCardDataArr = await getCardData(cardIdArr); //[5,6,7,8,9]
        $currentCard = $cardContainer.querySelector(".card:last-child");
    };

    const InsertCard = () => {
        if (cardIdIndex >= 5) {
            currentCardDataArr = nextCardDataArr;
            //currentCardDataArr = [5,6,7,8,9]
            cardIdArr = cardIdArr.map((el) => el + 5);
            (async () => {
                nextCardDataArr = await getCardData(cardIdArr);
            })();
            //nextCardDataArr = [10,11,12,13,14]
            cardIdIndex = 0;
        }
        $cardContainer.insertBefore(Item(currentCardDataArr[cardIdIndex]), $cardContainer.firstElementChild);
        cardIdIndex++;
    };

    const Swipe = (preference) => {
        try {
            $currentCard.classList.add(`action_${preference}`);
            const $prev = $currentCard;
            const $next = $currentCard.previousElementSibling;
            $currentCard = $next;

            const RemoveSwipedCard = () => {
                $cardContainer.removeChild($prev);
                $prev.removeEventListener("animationend", RemoveSwipedCard);
            };
            $prev.addEventListener("animationend", RemoveSwipedCard);

            InsertCard();
        } catch (e) {
            console.log(e);
        }
    };

    InitBtn();
    InitData();
}
app();
