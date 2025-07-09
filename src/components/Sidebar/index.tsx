import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';

import { BiEditAlt, BiFolderOpen, BiHomeSmile, BiSliderAlt, BiShieldQuarter, BiCategoryAlt, BiBug } from "react-icons/bi";
import { TbBrandAirtable } from "react-icons/tb";

import { useUserStore } from '@/stores';
import { getRoleRouteListAPI } from '@/api/Role'
import { Route } from '@/types/app/route';
import logo from '/logo.png'
import useVersionData from '@/hooks/useVersionData';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

// 定义导航项的类型
interface MenuItem {
  to: string;
  path: string;
  icon: JSX.Element;
  name: string | JSX.Element;
  subMenu?: SubMenuItem[];
}

interface SubMenuItem {
  to: string;
  path: string;
  name: string;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const store = useUserStore();
  const version = useVersionData();
  const { pathname } = location;

  // 创建 ref 用于触发器和侧边栏元素
  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  // 从 localStorage 获取侧边栏展开状态
  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  // 点击事件处理：点击侧边栏外部时关闭侧边栏
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // 键盘事件处理：按 ESC 键关闭侧边栏
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  // 侧边栏展开状态持久化处理
  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  const [isSideBarTheme, setIsSideBarTheme] = useState<"dark" | "light">("light")
  // const [isSideBarTheme, setIsSideBarTheme] = useState<"dark" | "light">("dark")

  // 定义导航项的样式类
  const sidebarItemStyDark = "group relative flex items-center gap-2.5 py-2 px-4 text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 rounded-sm font-medium"
  const sidebarItemStyLight = "group relative flex items-center gap-2.5 py-2 px-4 text-[#444] dark:text-slate-200 duration-300 ease-in-out hover:bg-[rgba(241,241,244,0.9)] dark:hover:bg-meta-4 rounded-[10px] hover:backdrop-blur-[15px]"
  const sidebarItemActiveSty = `${isSideBarTheme === "dark" ? "bg-graydark dark:bg-meta-4" : "!text-primary"}`

  // 箭头图标组件：用于显示子菜单的展开/收起状态
  const Arrow = ({ open }: { open: boolean }) => {
    return <svg
      className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
        }`}
      width="17"
      height="17"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
        fill="#ccc"
      />
    </svg>
  }

  // 定义完整的路由列表配置
  const routesAll: { group: string; list: MenuItem[] }[] = [
    {
      group: "",
      list: [
        {
          to: "/",
          path: "dashboard",
          icon: <BiHomeSmile className='text-[22px]' />,
          name: "仪表盘"
        },
        {
          to: "#",
          path: "write",
          icon: <BiEditAlt className='text-[22px]' />,
          name: "创作",
          subMenu: [
            {
              to: "/create",
              path: "create",
              name: "谱写"
            },
            {
              to: "/create_record",
              path: "create_record",
              name: "闪念"
            },
            {
              to: "/draft",
              path: "draft",
              name: "草稿箱"
            },
            {
              to: "/recycle",
              path: "recycle",
              name: "回收站"
            }
          ]
        },
        {
          to: "#",
          path: "manage",
          icon: <BiCategoryAlt className='text-[22px]' />,
          name: "管理",
          subMenu: [
            {
              to: "/article",
              path: "article",
              name: "文章管理"
            },
            {
              to: "/assistant",
              path: "assistant",
              name: "助手管理"
            },
            {
              to: "/record",
              path: "record",
              name: "说说管理"
            },
            {
              to: "/tag",
              path: "tag",
              name: "标签管理"
            },
            {
              to: "/comment",
              path: "comment",
              name: "评论管理"
            },
            {
              to: "/wall",
              path: "wall",
              name: "留言管理"
            },
            {
              to: "/cate",
              path: "cate",
              name: "分类管理"
            },
            {
              to: "/web",
              path: "web",
              name: "网站管理"
            },
            {
              to: "/album",
              path: "album",
              name: "相册管理"
            },
            {
              to: "/swiper",
              path: "swiper",
              name: "轮播图管理"
            },
            {
              to: "/footprint",
              path: "footprint",
              name: "足迹管理"
            },
            {
              to: "/user",
              path: "user",
              name: "用户管理"
            },
            {
              to: "/storage",
              path: "storage",
              name: "存储管理"
            },
            {
              to: "/config",
              path: "config",
              name: "项目配置"
            },
          ]
        },
        {
          to: "#",
          path: "rights",
          icon: <BiShieldQuarter className='text-[22px]' />,
          name: "权限",
          subMenu: [
            {
              to: "/route",
              path: "route",
              name: "路由管理"
            },
            {
              to: "/role",
              path: "role",
              name: "角色管理"
            },
          ]
        },
        {
          to: "/setup",
          path: "setup",
          icon: <BiSliderAlt className='text-[22px]' />,
          name: "系统"
        }
      ]
    },
    {
      group: "New",
      list: [
        {
          to: "/work",
          path: "work",
          icon: <TbBrandAirtable className='text-[22px]' />,
          name: "工作台"
        },
        {
          to: "/file",
          path: "file",
          icon: <BiFolderOpen className='text-[22px]' />,
          name: "文件系统"
        },
        {
          to: "/iter",
          path: "iter",
          icon: <BiBug className='text-[22px]' />,
          name: <div className='flex items-center w-full justify-between'>
            <span>更新日志</span>
            <div className='flex items-center gap-1'>
              {
                version.tag_name === import.meta.env.VITE_VERSION ? (
                  <span className={`text-xs text-white px-2 py-0.5 rounded-lg bg-green-500`}>最新版</span>
                ) : (
                  <span className={`text-xs text-white px-2 py-0.5 rounded-lg bg-red-400`}>有新版本</span>
                )
              }
            </div>
          </div>
        }
      ]
    }
  ];

  // 状态：存储过滤后的路由列表
  const [routes, setRoutes] = useState<typeof routesAll>([])

  // 获取角色对应的路由列表
  const getRouteList = async (id: number) => {
    const { data } = await getRoleRouteListAPI(id)
    // 处理成路径
    const pathSet = new Set(data.map((item: Route) => item.path));

    // 过滤出接口中存在的路由
    const filteredRoutes = routesAll.map(group => ({
      ...group,
      list: group.list.map(item => {
        if (item.subMenu) {
          // 过滤出当前子菜单中所有存在的路由
          const filteredSubMenu = item.subMenu.filter(subItem => pathSet.has(subItem.to));
          return filteredSubMenu.length > 0 ? { ...item, subMenu: filteredSubMenu } : null;
        }

        return pathSet.has(item.to) ? item : null;
      }).filter(item => item !== null)
    })).filter(group => group.list.length > 0);

    setRoutes(filteredRoutes);
  }

  // 当用户角色信息更新时，重新获取路由列表
  useEffect(() => {
    if (store.role.id) getRouteList(store.role.id)
  }, [store])

  // 渲染侧边栏组件
  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-99 flex h-screen w-64 flex-col overflow-y-hidden duration-300 ease-linear lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isSideBarTheme === "dark" ? "bg-black dark:bg-boxdark" : "bg-light-gradient dark:bg-dark-gradient border-r border-stroke dark:border-strokedark transition-all"}`}
    >
      {/* Logo 和标题区域 */}
      <div className="flex justify-center items-center gap-2 px-6 py-5.5 pb-0 lg:pt-6">
        <NavLink to="/" className={`flex items-center ${isSideBarTheme === "dark" ? "font-bold text-white" : "text-[#555] dark:text-white"}`}>
          <img src={logo} alt="logo" className='w-8 mr-2.5' />
          <div>龙氏Thrive X 🎉</div>
        </NavLink>

        {/* 移动端侧边栏触发器按钮 */}
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        />
      </div>

      {/* 导航菜单区域 */}
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="pt-2 pb-4 lg:px-6">
          {/* 遍历路由组并渲染 */}
          {routes.map((group, index) => (
            <div key={index}>
              {/* 路由组标题 */}
              <h3 className="mb-4 ml-4 text-sm font-semibold">
                {group.group}
              </h3>

              {/* 路由列表 */}
              <ul className="mb-6 flex flex-col gap-1.5">
                {group.list.map((item, subIndex) => (
                  // 根据是否有子菜单渲染不同的导航项
                  item.subMenu ? (
                    // 带子菜单的导航项组件
                    <SidebarLinkGroup
                      key={subIndex}
                      activeCondition={false}
                    >
                      {(handleClick, open) => (
                        <React.Fragment>
                          {/* 父级菜单项 */}
                          <NavLink
                            to={item.to}
                            className={`${isSideBarTheme === "dark" ? sidebarItemStyDark : sidebarItemStyLight}`}
                            onClick={(e) => {
                              e.preventDefault();
                              sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                            }}
                          >
                            {item.icon}
                            {item.name}
                            <Arrow open={open} />
                          </NavLink>

                          {/* 子菜单项 */}
                          <div className={`translate transform overflow-hidden ${!open && 'hidden'}`}>
                            <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                              {item.subMenu!.map((subItem, subSubIndex) => (
                                <li key={subSubIndex}>
                                  <NavLink
                                    to={subItem.to}
                                    className={({ isActive }) =>
                                      `group relative flex items-center gap-2.5 rounded-md px-4 duration-300 ease-in-out ${isSideBarTheme === "dark" ? 'hover:text-white text-bodydark2 font-medium' : 'hover:!text-primary text-[#666] dark:text-slate-400'} ` +
                                      (isActive && '!text-primary')
                                    }
                                  >
                                    {subItem.name}
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </React.Fragment>
                      )}
                    </SidebarLinkGroup>
                  ) : (
                    // 普通导航项
                    <li key={subIndex}>
                      <NavLink
                        to={item.to}
                        className={`${isSideBarTheme === "dark" ? sidebarItemStyDark : sidebarItemStyLight} ${pathname.includes(item.path) && sidebarItemActiveSty}`}
                      >
                        {item.icon}
                        {item.name}
                      </NavLink>
                    </li>
                  )
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;