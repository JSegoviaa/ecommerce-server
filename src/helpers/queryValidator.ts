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
