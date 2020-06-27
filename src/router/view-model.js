
import { types } from 'mobx-state-tree'
import { AutoView as Group } from 'group'
import Home from 'pages/HomePage'
import Mine from 'pages/UserCenterPage'
import BookInfo from 'pages/BookInfoPage'

const pages = [
  Home,
  Mine,
  BookInfo,
]

// mem
export const ViewModel = types.union({
  dispatcher: sn => {
    const view = sn.view || 'home';
    return viewModels[view] || Group
  }
})


export const viewModels = {}
export const viewData = {}
export const viewComp = new Map()

pages.forEach(page=>{
  // 名称
  const view = page.config.view
  // page loader
  viewModels[view] = page.ViewModel.named(view)
  // page data
  viewData[view] = page.config
  // page component
  viewComp.set(view, page.Component)

})


export default types.optional(ViewModel, { attrs: {} });
