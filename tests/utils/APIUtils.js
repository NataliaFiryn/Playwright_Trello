const { expect, request } = require('@playwright/test')
require('dotenv').config()
class APIUtils {
    constructor(apiContext) {
        this.apiContext = apiContext
        this.allBoards = {}
        this.boardId
        this.listId
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
        //console.log(createBoardResponseJson)
        this.boardId = createBoardResponseJson.id
        console.log(this.boardId)
        return this.boardId
    }
    async createList(listName) {
        const createListResponse = await this.apiContext.post('https://api.trello.com/1/lists', {
            params: {
                name: listName,
                idBoard: this.boardId,
                key: process.env.KEY,
                token: process.env.TOKEN,
            }
        })
        expect(await createListResponse.status()).toBe(200)
        const createListResponseJson = JSON.parse(await createListResponse.text())
        //console.log(createListResponseJson)
        this.listId = createListResponseJson.id
        console.log(this.listId)
        return this.listId
    }
    async getExistingListId(listNumber) {
        const getExistingListResponse = await this.apiContext.get('https://api.trello.com/1/boards/' + this.boardId + '/lists', {
            params: {
                key: process.env.KEY,
                token: process.env.TOKEN,
            }
        })
        expect(await getExistingListResponse.status()).toBe(200)
        const getExistingListResponseJson = JSON.parse(await getExistingListResponse.text())
        //console.log(getExistingListResponseJson)
        this.existingListId = getExistingListResponseJson[listNumber].id
        console.log(this.existingListId)
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
        //console.log(createCardResponseJson)
        this.cardId = createCardResponseJson.id
        console.log(this.cardId)
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
        const deleteCardResponseJson = JSON.parse(await deleteCardResponse.text())
        console.log(deleteCardResponseJson)
    }
    async deleteCard() {
        const deleteCardResponse = await this.apiContext.delete('https://api.trello.com/1/cards/' + this.cardId, {
            params: {
                key: process.env.KEY,
                token: process.env.TOKEN,
            }
        })
        expect(await deleteCardResponse.status()).toBe(200)
        const deleteCardResponseJson = JSON.parse(await deleteCardResponse.text())
        console.log(deleteCardResponseJson)
    }
    async deleteBoard(){
        const deleteBoardResponse = await this.apiContext.delete('https://api.trello.com/1/boards/' + this.boardId, {
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