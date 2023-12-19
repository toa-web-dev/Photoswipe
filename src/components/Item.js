export function Item(_data) {
    const $figure = document.createElement("figure");
    $figure.id = _data.id;
    $figure.classList.add("card");
    $figure.style.backgroundImage = `url(${_data.url})`;
    const $figcap = document.createElement("figcaption");
    $figcap.textContent = _data.id;
    $figure.appendChild($figcap);

    return $figure;
}
