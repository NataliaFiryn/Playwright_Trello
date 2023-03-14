const { expect, request } = require('@playwright/test')
require('dotenv').config()
class APIUtils {
    constructor(apiContext) {
        this.apiContext = apiContext
        this.allBoards = {}
        this.board ={}
        this.list = {}
        this.existingListId
        this.cardId
    }
    async getFirstBoardID() {
        const allBoardsResponse = await this.apiContext.get('https://api.trello.com/1/members/me/boards', {
            params: {
                key: process.env.KEY,
                token: process.env.TOKEN,
            }
        })
        expect(await allBoardsResponse.status()).toBe(200)
        const allBoardsResponseJson = JSON.parse(await allBoardsResponse.text())
        this.allBoards.count = allBoardsResponseJson.length
        this.allBoards.firstBoardId = allBoardsResponseJson[0].id
        console.log(this.allBoards)
        return this.allBoards
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
        //console.log(createBoardResponseJson)
        this.board.id = createBoardResponseJson.id
        this.board.name = createBoardResponseJson.name
        this.board.url = createBoardResponseJson.url
        //console.log(this.board)
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
        expect( await createListResponseJson.closed).toEqual(false)
        expect( await createListResponseJson.idBoard).toEqual(this.board.id)
        expect( await createListResponseJson.name).toEqual(listName)
        //console.log(createListResponseJson)
        this.list.id = createListResponseJson.id
        this.list.name = createListResponseJson.name
        //console.log(this.list)
        return this.list
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
        //console.log(getExistingListResponseJson)
        this.existingListId = getExistingListResponseJson[listNumber].id
        //console.log(this.existingListId)
        return this.existingListId
    }
    async createCard(cardName) {
        const createCardResponse = await this.apiContext.post('https://api.trello.com/1/cards', {
            params: {
                name: cardName,
                idList: this.list.id,
                key: process.env.KEY,
                token: process.env.TOKEN,
            }
        })
        expect(await createCardResponse.status()).toBe(200)
        const createCardResponseJson = JSON.parse(await createCardResponse.text())
        expect (await createCardResponseJson.closed).toEqual(false)
        expect (await createCardResponseJson.name).toEqual(cardName)
        expect (await createCardResponseJson.idBoard).toEqual(this.board.id)
        expect (await createCardResponseJson.idList).toEqual(this.list.id)
        //console.log(createCardResponseJson)
        this.cardId = createCardResponseJson.id
        //console.log(this.cardId)
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
        expect (await moveCardResponseJson.idBoard).toEqual(this.board.id)
        expect (await moveCardResponseJson.idList).toEqual(this.existingListId)
        expect (await moveCardResponseJson.id).toEqual(this.cardId)
        //console.log(moveCardResponseJson)
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
    async deleteBoard(){
        const deleteBoardResponse = await this.apiContext.delete('https://api.trello.com/1/boards/' + this.board.id, {
            params: {
                key: process.env.KEY,
                token: process.env.TOKEN,
            }
        })
        expect(await deleteBoardResponse.status()).toBe(200) 
    }
    async deleteAllBoards() {
        await this.getFirstBoardID()
        for (let i = 0; i <= this.allBoards.count; ++i) {
            await this.getFirstBoardID()
            if (this.allBoards.count > 0) {
                const deleteBoardResponse = await this.apiContext.delete('https://api.trello.com/1/boards/' + this.allBoards.firstBoardId, {
                    params: {
                        key: process.env.KEY,
                        token: process.env.TOKEN,
                    }
                })
                expect(await deleteBoardResponse.status()).toBe(200)
            }
        }
    }
}
module.exports = { APIUtils }; 