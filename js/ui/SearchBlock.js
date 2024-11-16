/**
 * Класс SearchBlock
 * Используется для взаимодействием со строкой ввода и поиска изображений
 * */
class SearchBlock {
  constructor(element) {
    this.element = element;
    this.getVKid;
  }

  /**
   * Выполняет подписку на кнопки "Заменить" и "Добавить"
   * Клик по кнопкам выполняет запрос на получение изображений и отрисовывает их,
   * только клик по кнопке "Заменить" перед отрисовкой очищает все отрисованные ранее изображения
   */
  registerEvents() {
    const replacePhoto = this.element.getElementsByClassName("replace")[0]
    const addPhoto = this.element.getElementsByClassName("add")[0]
    const inputId = this.element.querySelector('input')

    inputId.onchange = function (event) {
      this.getVKid = Number(event.target.value)
      event.target.value = ''
      replacePhoto.addEventListener('click', () => {
        if (this.getVKid !== 0) {
          ImageViewer.clear()
          VK.get(this.getVKid)
          this.getVKid = 0
          App.imageViewer.registerEvents()
        }
      })
      addPhoto.addEventListener('click', () => {
        if (this.getVKid !== 0) {
          VK.get(this.getVKid)
          this.getVKid = 0
          App.imageViewer.registerEvents()
        }
      })
    }
  }
}
