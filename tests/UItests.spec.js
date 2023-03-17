const { test, expect, request } = require('@playwright/test')
const { APIUtils } = require('../tests/utils/APIUtils')
const { PageObjectsManager } = require('../pageobjects/pageObjectsManager')

test.describe('UI Tests', () => {
    test.beforeEach(async ({ page }) => {
        const pageObjectsManager = new PageObjectsManager(page)
        const workspacePage = pageObjectsManager.getWorkspacePage()
        await workspacePage.login()
    });
    test('Create board', async ({ page }) => {
        const pageObjectsManager = new PageObjectsManager(page)
        const workspacePage = pageObjectsManager.getWorkspacePage()
        await workspacePage.createBoard('Peach Board', '🍑', 'Workspace')
    })
    test('Create list', async ({ page, request }) => {
        const pageObjectsManager = new PageObjectsManager(page)
        const apiRequest = new APIUtils(request)
        const workspacePage = pageObjectsManager.getWorkspacePage()
        const boardPage = pageObjectsManager.getBoardPage()

        const board = await apiRequest.createBoard('First Board')
        await workspacePage.goToBoard(board.url)
        await boardPage.createList('New List')
    })
    test('Create cart', async ({ page, request }) => {
        const pageObjectsManager = new PageObjectsManager(page)
        const apiRequest = new APIUtils(request)
        const workspacePage = pageObjectsManager.getWorkspacePage()
        const boardPage = pageObjectsManager.getBoardPage()

        const board = await apiRequest.createBoard('Second Board')
        await apiRequest.createList('New List')
        await workspacePage.goToBoard(board.url)
        await boardPage.createCart('New Cart')
    })
    test('Move cart', async ({page, request}) => {
        const pageObjectsManager = new PageObjectsManager(page)
        const apiRequest = new APIUtils(request)
        const workspacePage = pageObjectsManager.getWorkspacePage()
        const boardPage = pageObjectsManager.getBoardPage()

        const board = await apiRequest.createBoard('Third Board')
        await apiRequest.createList('New List')
        await apiRequest.createCard('New Card')
        await workspacePage.goToBoard(board.url)
        await boardPage.moveCart('Doing')
    })
    test('Delete cart', async ({ page, request }) => {
        const pageObjectsManager = new PageObjectsManager(page)
        const apiRequest = new APIUtils(request)
        const workspacePage = pageObjectsManager.getWorkspacePage()
        const boardPage = pageObjectsManager.getBoardPage()

        const board = await apiRequest.createBoard('Fourth Board')
        await apiRequest.createList('New List')
        await apiRequest.createCard('New Card')
        await workspacePage.goToBoard(board.url)
        await boardPage.deleteCart()
    })
    test('Delete board', async ({ page, request }) => {
        const pageObjectsManager = new PageObjectsManager(page)
        const apiRequest = new APIUtils(request)
        const workspacePage = pageObjectsManager.getWorkspacePage()
        const boardPage = pageObjectsManager.getBoardPage()

        const board = await apiRequest.createBoard('Fifth Board')
        await workspacePage.goToBoard(board.url)
        await boardPage.deleteBoard()
    })
    test('Delete all boards', async ({page}) => {
        const pageObjectsManager = new PageObjectsManager(page)
        const boardPage = pageObjectsManager.getBoardPage()
        await boardPage.deleteAllBoards()
    })

})