export interface CategoryJsonModel {
  id: string
  translations: {
    [key: string]: {
      name: string
      description: string
    }
  }
  imageUrl: string | null
  imageAltTitle: {
    [key: string]: string
  }
  parentId: string | null
  slugs: {
    [key: string]: string
  }
}
