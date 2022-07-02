type SortQuery = 'ASC' | 'DESC';

type OrderByUser =
  | 'id'
  | 'first_name'
  | 'last_name'
  | 'email'
  | 'created_at'
  | 'updated_at'
  | 'role_id';

type OrderByCategory =
  | 'id'
  | 'title'
  | 'is_published'
  | 'created_at'
  | 'updated_at';

type OrderByProduct =
  | 'id'
  | 'title'
  | 'discount'
  | 'is_published'
  | 'is_active'
  | 'created_by'
  | 'updated_by'
  | 'created_at'
  | 'updated_at';

type OrderByAddress =
  | 'id'
  | 'country'
  | 'state'
  | 'municipality'
  | 'city'
  | 'colony'
  | 'postal_code'
  | 'address'
  | 'info'
  | 'user_id';

type OrderByCode =
  | 'id'
  | 'name'
  | 'discount'
  | 'created_at'
  | 'updated_at'
  | 'expires_at'
  | 'is_active';

type OrderByFavorites = 'id' | 'title' | 'created_at';

type Upload = 'categories' | 'subcategories' | 'products';

type OrderByComments =
  | 'id'
  | 'created_at'
  | 'title'
  | 'user_id'
  | 'product_id'
  | 'comment';

export const sortQueryValidator = (query: SortQuery) => {
  switch (query) {
    case 'ASC':
      return query;
    case 'DESC':
      return query;
    default:
      throw new Error(`${query} no es una forma de ordenamiento válida`);
  }
};

export const userQueryVaidator = (query: OrderByUser) => {
  switch (query) {
    case 'id':
      return query;
    case 'created_at':
      return query;
    case 'email':
      return query;
    case 'first_name':
      return query;
    case 'last_name':
      return query;
    case 'role_id':
      return query;
    case 'updated_at':
      return query;

    default:
      throw new Error(`${query} no es una forma de ordenamiento válida.`);
  }
};

export const categoryQueryValidator = (query: OrderByCategory) => {
  switch (query) {
    case 'created_at':
      return query;
    case 'id':
      return query;
    case 'is_published':
      return query;
    case 'title':
      return query;
    case 'updated_at':
      return query;

    default:
      throw new Error(`${query} no es una forma de ordenamiento válida.`);
  }
};

export const productQueryValidator = (query: OrderByProduct) => {
  switch (query) {
    case 'id':
      return query;
    case 'created_at':
      return query;
    case 'created_by':
      return query;
    case 'discount':
      return query;
    case 'is_active':
      return query;
    case 'is_published':
      return query;
    case 'title':
      return query;
    case 'updated_at':
      return query;
    case 'updated_by':
      return query;

    default:
      throw new Error(`${query} no es una forma de ordenamiento válida.`);
  }
};

export const addressQueryValidator = (query: OrderByAddress) => {
  switch (query) {
    case 'address':
      return query;
    case 'city':
      return query;
    case 'colony':
      return query;
    case 'country':
      return query;
    case 'id':
      return query;
    case 'info':
      return query;
    case 'municipality':
      return query;
    case 'postal_code':
      return query;
    case 'state':
      return query;
    case 'user_id':
      return query;

    default:
      throw new Error(`${query} no es una forma de ordenamiento válida.`);
  }
};

export const codesQueryValidator = (query: OrderByCode) => {
  switch (query) {
    case 'created_at':
      return query;
    case 'discount':
      return query;
    case 'expires_at':
      return query;
    case 'id':
      return query;
    case 'is_active':
      return query;
    case 'name':
      return query;
    case 'updated_at':
      return query;

    default:
      throw new Error(`${query} no es una forma de ordenamiento válida.`);
  }
};

export const uploadTypeQueryValidator = (query: Upload) => {
  switch (query) {
    case 'categories':
      return query;
    case 'subcategories':
      return query;
    case 'products':
      return query;

    default:
      throw new Error(`${query} no es un parámetro permitido.`);
  }
};

export const favoritesQueryValidator = (query: OrderByFavorites) => {
  switch (query) {
    case 'created_at':
      return query;
    case 'id':
      return query;
    case 'title':
      return query;

    default:
      throw new Error(`${query} no es un parámetro permitido.`);
  }
};

export const commentsQueryValidator = (query: OrderByComments) => {
  switch (query) {
    case 'created_at':
      return query;
    case 'id':
      return query;
    case 'title':
      return query;
    case 'comment':
      return query;
    case 'created_at':
      return query;
    case 'product_id':
      return query;
    case 'user_id':
      return query;

    default:
      throw new Error(`${query} no es un parámetro permitido.`);
  }
};
