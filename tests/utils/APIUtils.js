const { expect, request } = require('@playwright/test')
require('dotenv').config()
class APIUtils {
    constructor(apiContext) {
        this.apiContext = apiContext
        this.allBoards = {}
        this.board = {}
        this.listId
        this.existingListId
        this.cardId
    }
    async getBoardsIds() {
        const allBoardsResponse = await this.apiContext.get('https://api.trello.com/1/members/me/boards', {
            params: {
                key: process.env.KEY,
                token: process.env.TOKEN,
            }
        })
        expect(await allBoardsResponse.status()).toBe(200)
        const allBoardsResponseJson = JSON.parse(await allBoardsResponse.text())
        const result = allBoardsResponseJson.map(board => board.id)
        console.log(result)
        return result
    }
    async createBoard(boardName) {
        const createBoardResponse = await this.apiContext.post('https://api.trello.com/1/boards/', {
            params: {
                name: boardName,
                key: process.env.KEY,
                token: process.env.TOKEN,
            }
        })
        expect(await createBoardResponse.status()).toBe(200)
        const createBoardResponseJson = JSON.parse(await createBoardResponse.text())
        expect(await createBoardResponseJson.closed).toEqual(false)
        expect(await createBoardResponseJson.prefs.permissionLevel).toEqual('private')
        this.board.id = createBoardResponseJson.id
        this.board.url = createBoardResponseJson.url
        return this.board
    }
    async createList(listName) {
        const createListResponse = await this.apiContext.post('https://api.trello.com/1/lists', {
            params: {
                name: listName,
                idBoard: this.board.id,
                key: process.env.KEY,
                token: process.env.TOKEN,
            }
        })
        expect(await createListResponse.status()).toBe(200)
        const createListResponseJson = JSON.parse(await createListResponse.text())
        expect(await createListResponseJson.closed).toEqual(false)
        expect(await createListResponseJson.idBoard).toEqual(this.board.id)
        expect(await createListResponseJson.name).toEqual(listName)
        this.listId = createListResponseJson.id
        return this.listId
    }
    async getExistingListId(listNumber) {
        const getExistingListResponse = await this.apiContext.get('https://api.trello.com/1/boards/' + this.board.id + '/lists', {
            params: {
                key: process.env.KEY,
                token: process.env.TOKEN,
            }
        })
        expect(await getExistingListResponse.status()).toBe(200)
        const getExistingListResponseJson = JSON.parse(await getExistingListResponse.text())
        this.existingListId = getExistingListResponseJson[listNumber].id
        return this.existingListId
    }
    async createCard(cardName) {
        const createCardResponse = await this.apiContext.post('https://api.trello.com/1/cards', {
            params: {
                name: cardName,
                idList: this.listId,
                key: process.env.KEY,
                token: process.env.TOKEN,
            }
        })
        expect(await createCardResponse.status()).toBe(200)
        const createCardResponseJson = JSON.parse(await createCardResponse.text())
        expect(await createCardResponseJson.closed).toEqual(false)
        expect(await createCardResponseJson.name).toEqual(cardName)
        expect(await createCardResponseJson.idBoard).toEqual(this.board.id)
        expect(await createCardResponseJson.idList).toEqual(this.listId)
        this.cardId = createCardResponseJson.id
        return this.cardId
    }
    async moveCardFromCreatedListToExistingList() {
        const moveCardResponse = await this.apiContext.put('https://api.trello.com/1/cards/' + this.cardId, {
            params: {
                idList: this.existingListId,
                key: process.env.KEY,
                token: process.env.TOKEN,
            }
        })
        expect(await moveCardResponse.status()).toBe(200)
        const moveCardResponseJson = JSON.parse(await moveCardResponse.text())
        expect(await moveCardResponseJson.idBoard).toEqual(this.board.id)
        expect(await moveCardResponseJson.idList).toEqual(this.existingListId)
        expect(await moveCardResponseJson.id).toEqual(this.cardId)
    }
    async deleteCard() {
        const deleteCardResponse = await this.apiContext.delete('https://api.trello.com/1/cards/' + this.cardId, {
            params: {
                key: process.env.KEY,
                token: process.env.TOKEN,
            }
        })
        expect(await deleteCardResponse.status()).toBe(200)
    }
    async deleteBoard() {
        const deleteBoardResponse = await this.apiContext.delete('https://api.trello.com/1/boards/' + this.board.id, {
            params: {
                key: process.env.KEY,
                token: process.env.TOKEN,
            }
        })
        expect(await deleteBoardResponse.status()).toBe(200)
    }
    async deleteAllBoards() {
        const allBoardsIds = await this.getBoardsIds()
        for (let i = 0; i < allBoardsIds.length; i++) {
            const deleteBoardResponse = await this.apiContext.delete('https://api.trello.com/1/boards/' + allBoardsIds[i], {
                params: {
                    key: process.env.KEY,
                    token: process.env.TOKEN,
                }
            })
            expect(await deleteBoardResponse.status()).toBe(200)
        }
    }
}
module.exports = { APIUtils }; 