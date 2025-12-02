export interface TagJsonModel {
  id: string
  translations: {
    [key: string]: {
      name: string
    }
  }
  slugs: {
    [key: string]: string
  }
}
