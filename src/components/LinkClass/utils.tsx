/*
  Example:
  const router = useRouter();
  const activeMenu = useMemo(() => getActiveLink(menu, router.asPath), []);
 */

type MenuItem<T> = T & {
  path: string;
};

export function getActiveLink<T>(
  menuItems: MenuItem<T>[],
  currentPath: string,
): MenuItem<T> | null {
  const sortedMenuItems = [...menuItems].sort(
    (a, b) => b.path.length - a.path.length,
  );

  const currentPathSegments = currentPath.split('/').filter(Boolean);

  for (const item of sortedMenuItems) {
    const itemPathSegments = item.path.split('/').filter(Boolean);

    if (itemPathSegments.length !== currentPathSegments.length) {
      continue;
    }

    const match = itemPathSegments.every(
      (segment, index) => segment === currentPathSegments[index],
    );

    if (match) {
      return item;
    }
  }

  return null;
}
