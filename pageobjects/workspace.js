const { expect, request } = require('@playwright/test');
const { APIUtils } = require('../tests/utils/APIUtils')

class WorkspacePage {
    constructor(page) {
        this.page = page;
        this.loginEmail = page.locator('#user')
        this.continueButton = page.locator('#login')
        this.loginPassword = page.locator('#password')
        this.loginButton = page.locator('#login-submit')
        this.boards = page.locator('.board-tile-details')
        this.boardTitle = page.locator('.js-board-editing-target.board-header-btn-text')
        this.lists = page.locator('#board .js-list-content')
        this.listsHeaders = page.locator('.list-header-name')
        this.card = page.locator('.list-card')
        
    }
    async login(){
    await this.page.goto('https://trello.com/login')
    await this.loginEmail.type(process.env.LOGIN)
    await this.continueButton.click()
    await this.loginPassword.waitFor()
    await this.loginPassword.type(process.env.PASSWORD)
    await this.loginButton.click()
}
async addBoardByAPICheckOnUI(boardName){
    const apiContext = await request.newContext()
    const apiRequest = new APIUtils(apiContext)
    var board = await apiRequest.createBoard(boardName)
    let boardLink = (board.url).split('com')[1]
    await this.page.locator('[href="'+boardLink+'"]').click()
    expect (await this.boardTitle).toHaveText(boardName)
    expect (await this.lists).toHaveCount(3)
}
async addListByAPICheckOnUI(boardName, listName){
    const apiContext = await request.newContext()
    const apiRequest = new APIUtils(apiContext)
    var board = await apiRequest.createBoard(boardName)
    var list = await apiRequest.createList(listName)
    console.log(list)
    let boardLink = (board.url).split('com')[1]
    await this.page.locator('[href="'+boardLink+'"]').click()
    expect (await this.lists).toHaveCount(4)
    expect (await this.listsHeaders.nth(0)).toHaveText(listName)
}
async addCartByAPICheckOnUI(boardName, listName, cardName){
    const apiContext = await request.newContext()
    const apiRequest = new APIUtils(apiContext)
    var board = await apiRequest.createBoard(boardName)
    await apiRequest.createList(listName)
    await apiRequest.createCard(cardName)
    let boardLink = (board.url).split('com')[1]
    await this.page.locator('[href="'+boardLink+'"]').click()
    expect (await this.card).toHaveJSProperty('innerText', cardName)
    expect (( this.lists.nth(0)).filter({has: this.card})).toHaveCount(1)
}
async moveCartByAPICheckOnUI(boardName, listName, cardName,listNumber){
    const apiContext = await request.newContext()
    const apiRequest = new APIUtils(apiContext)
    var board = await apiRequest.createBoard(boardName)
    await apiRequest.createList(listName)
    await apiRequest.createCard(cardName)
    let boardLink = (board.url).split('com')[1]
    await this.page.locator('[href="'+boardLink+'"]').click()
    expect (await this.card).toHaveJSProperty('innerText', cardName)
    expect (( this.lists.nth(0)).filter({has: this.card})).toHaveCount(1)
    await apiRequest.getExistingListId(listNumber)
    await apiRequest.moveCardFromCreatedListToExistingList()
    expect (( this.lists.nth(0)).filter({has: this.card})).toHaveCount(0)
    expect (( this.lists.nth(listNumber)).filter({has: this.card})).toHaveCount(1)
}
async deleteCartByAPICheckOnUI(boardName, listName, cardName){
    const apiContext = await request.newContext()
    const apiRequest = new APIUtils(apiContext)
    var board = await apiRequest.createBoard(boardName)
    await apiRequest.createList(listName)
    await apiRequest.createCard(cardName)
    let boardLink = (board.url).split('com')[1]
    await this.page.locator('[href="'+boardLink+'"]').click()
    expect (await this.card).toHaveJSProperty('innerText', cardName)
    await apiRequest.deleteCard()
    expect(await this.card).toHaveCount(0)
}
async deleteBoardByAPICheckOnUI(boardName){
    const apiContext = await request.newContext()
    const apiRequest = new APIUtils(apiContext)
    var board = await apiRequest.createBoard(boardName)
    let boardLink = (board.url).split('com')[1]
    await this.page.locator('[href="'+boardLink+'"]').click()
    await apiRequest.deleteBoard()
    expect (await this.page.locator('#content h1')).toContainText('Board not found.')
}
async deleteAllBoardByAPICheckOnUI(){
    const apiContext = await request.newContext()
    const apiRequest = new APIUtils(apiContext)
    await apiRequest.deleteAllBoards()
    expect (await this.boards).toHaveCount(0)
}
}
module.exports = { WorkspacePage };