const { expect, request } = require('@playwright/test')
require('dotenv').config()
class APIUtils {
    constructor(apiContext) {
        this.apiContext = apiContext
        this.KEY = process.env.KEY
        this.TOKEN = process.env.TOKEN
        this.allBoards = {}
        this.board = {}
        this.listId
        this.existingListId
        this.cardId
    }
    async getAllBoardsIds() {
        const allBoardsResponse = await this.apiContext.get('https://api.trello.com/1/members/me/boards', {
            params: {
                key: this.KEY,
                token: this.TOKEN,
            }
        })
        expect(await allBoardsResponse.status()).toBe(200)
        const allBoardsResponseJson = await allBoardsResponse.json()
        const result = allBoardsResponseJson.map(board => board.id)
        return result
    }
    async createBoard(boardName) {
        const createBoardResponse = await this.apiContext.post('https://api.trello.com/1/boards/', {
            params: {
                name: boardName,
                key: this.KEY,
                token: this.TOKEN,
            }
        })
        expect(await createBoardResponse.status()).toBe(200)
        const createBoardResponseJson = await createBoardResponse.json()
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
                key: this.KEY,
                token: this.TOKEN,
            }
        })
        expect(await createListResponse.status()).toBe(200)
        const createListResponseJson = await createListResponse.json()
        expect(await createListResponseJson.closed).toEqual(false)
        expect(await createListResponseJson.idBoard).toEqual(this.board.id)
        expect(await createListResponseJson.name).toEqual(listName)
        this.listId = createListResponseJson.id
        return this.listId
    }
    async getExistingListId(listNumber) {
        const getExistingListResponse = await this.apiContext.get('https://api.trello.com/1/boards/' + this.board.id + '/lists', {
            params: {
                key: this.KEY,
                token: this.TOKEN,
            }
        })
        expect(await getExistingListResponse.status()).toBe(200)
        const getExistingListResponseJson = await getExistingListResponse.json()
        this.existingListId = getExistingListResponseJson[listNumber].id
        return this.existingListId
    }
    async createCard(cardName) {
        const createCardResponse = await this.apiContext.post('https://api.trello.com/1/cards', {
            params: {
                name: cardName,
                idList: this.listId,
                key: this.KEY,
                token: this.TOKEN,
            }
        })
        expect(await createCardResponse.status()).toBe(200)
        const createCardResponseJson = await createCardResponse.json()
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
                key: this.KEY,
                token: this.TOKEN,
            }
        })
        expect(await moveCardResponse.status()).toBe(200)
        const moveCardResponseJson = await moveCardResponse.json()
        expect(await moveCardResponseJson.idBoard).toEqual(this.board.id)
        expect(await moveCardResponseJson.idList).toEqual(this.existingListId)
        expect(await moveCardResponseJson.id).toEqual(this.cardId)
    }
    async deleteCard() {
        const deleteCardResponse = await this.apiContext.delete('https://api.trello.com/1/cards/' + this.cardId, {
            params: {
                key: this.KEY,
                token: this.TOKEN,
            }
        })
        expect(await deleteCardResponse.status()).toBe(200)
    }
    async deleteBoard() {
        const deleteBoardResponse = await this.apiContext.delete('https://api.trello.com/1/boards/' + this.board.id, {
            params: {
                key: this.KEY,
                token: this.TOKEN,
            }
        })
        expect(await deleteBoardResponse.status()).toBe(200)
    }
    async deleteAllBoards() {
        const allBoardsIds = await this.getAllBoardsIds()
        for (let i = 0; i < allBoardsIds.length; i++) {
            const deleteBoardResponse = await this.apiContext.delete('https://api.trello.com/1/boards/' + allBoardsIds[i], {
                params: {
                    key: this.KEY,
                    token: this.TOKEN,
                }
            })
            expect(await deleteBoardResponse.status()).toBe(200)
        }
    }
}
module.exports = { APIUtils }; 