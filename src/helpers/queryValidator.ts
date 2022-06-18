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

type OrderByProduct = 'id';

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
      break;

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
