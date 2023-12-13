export async function getData(seed) {
    const data = await fetch(`https://picsum.photos/100/150?random=${seed}`);
    return;
}

// fetch 기능
/**
 * 1. 렌더링할 5장의 데이터를 fetch하여 let currentCardDataList에 할당한다
 * 2. currentCardDataList에서 map을 사용해 5장의 카드를 렌더링한다.
 * 3. 다음에 쓰일 5장의 데이터를 fetch하여 let nextCardDataList에 할당한다
 * 4. Item을 렌더링할때마다 let counter = 0을 counter++ 한다.
 * 5. counter가 5가되면 currentCardDataList에 nextCardDataList를 할당한다.
 * 6. counter = 0으로 초기화한다.
 * 7. 2부터 반복한다
 */
