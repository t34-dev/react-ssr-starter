import { UseMutationOptions, UseQueryOptions } from 'react-query';

import { ApiError, axiosClient, buildQueryString } from '@/api';
import { Post } from '@/models';
import { queryClient, Service } from '@/react-query';

// ========================================== getAll
interface GetAllParams {
  limit?: number | string;
}

interface GetAllInterface {
  createKey: (params: GetAllParams) => string[];

  (params: GetAllParams): UseQueryOptions<Post[], unknown>;
}

const getAll = (function () {
  const fn: GetAllInterface = function (
    params: GetAllParams,
  ): UseQueryOptions<Post[], unknown> {
    return {
      queryKey: fn.createKey(params),
      queryFn: async () => {
        const queryString = buildQueryString({ _limit: params.limit });
        return axiosClient
          .get<Post[]>(`/posts${queryString}`)
          .then((res) => res.data);
      },
      // keepPreviousData: true,
    };
  };

  fn.createKey = (params: GetAllParams): string[] => [
    'Posts',
    String(params.limit),
  ];

  return fn;
})();

// ========================================== getById
interface GetByIdParams {
  id: number | string;
}

interface GetByIdInterface {
  createKey: (params: GetByIdParams) => string[];

  (params: GetByIdParams): UseQueryOptions<Post, unknown>;
}

const getById = (function () {
  const fn: GetByIdInterface = function (
    params: GetByIdParams,
  ): UseQueryOptions<Post, unknown> {
    return {
      queryKey: fn.createKey(params),
      queryFn: async () => {
        return axiosClient
          .get<Post>(`/posts/${params.id}`)
          .then((res) => res.data);
      },
      // keepPreviousData: true,
    };
  };

  fn.createKey = (params: GetByIdParams): string[] => [
    'Post',
    String(params.id),
  ];

  return fn;
})();

// ========================================== updatePost
interface UpdatePostParams {
  id: number | string;
  data: Partial<Post>;
}

interface UpdatePostInterface {
  (): UseMutationOptions<Post, ApiError, UpdatePostParams>;
}

const updatePost = (function () {
  const fn: UpdatePostInterface = function (): UseMutationOptions<
    Post,
    ApiError,
    UpdatePostParams
  > {
    return {
      mutationFn: async (params) => {
        const { id, data } = params;
        return axiosClient
          .put<Post>(`/posts/${id}`, data)
          .then((res) => res.data);
      },
      onSuccess: (data) => {
        //// request request again
        // queryClient.invalidateQueries(
        //   Service.posts.getById.createKey({ id: data.id }),
        // );

        // just update the data
        queryClient.setQueryData<Post>(
          Service.posts.getById.createKey({ id: data.id }),
          data,
        );
      },
    };
  };

  return fn;
})();

export const PostService = { getAll, getById, updatePost };
