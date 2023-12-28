export function Item(_id) {
    const $figure = document.createElement("figure");
    $figure.id = _id;
    $figure.classList.add("card");
    const $figcap = document.createElement("figcaption");
    $figure.appendChild($figcap);
    return $figure;
}
