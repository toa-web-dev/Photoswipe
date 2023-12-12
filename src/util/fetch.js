export async function getData(seed) {
    const data = await fetch(`https://picsum.photos/100/150?random=${seed}`);
    return ;
}
