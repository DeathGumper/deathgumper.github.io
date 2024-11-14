export default class View {
    display = (rowElements) => {
        $('#boardContainer').empty();
        for (let i = 0; i < rowElements.length; i++) {
            $('#boardContainer').append(rowElements[i]);
        }
    }
}