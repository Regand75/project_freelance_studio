export class UrlUtils {
    static getUrlParam(param) {
        const urlParams = new URLSearchParams(window.location.search); // создаем объект, который позволяет работать с параметрами строки запроса в URL
        return  urlParams.get(param); // получаем параметр из текущего URL
    }
}