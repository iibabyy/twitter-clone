import { BsBellFill, BsHouseFill } from 'react-icons/bs';
import { FaUser } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';

import SidebarLogo from './SidebarLogo';
import SidebarItem from './SidebarItem';
import SidebarPostButton from './SidebarPostButton';
import useCurrentUser from '@/src/hooks/useCurrentUser';
import { signOut } from 'next-auth/react';

const Sidebar = () => {
	const { data: currentUser } = useCurrentUser();

	const items = [
		{
			label: "Home",
			href: "/",
			icon: BsHouseFill,
		},
		{
			label: "Notifications",
			href: "/notifications",
			icon: BsBellFill,
			auth: true,
		},
		{
			label: "Profile",
			href: `/${currentUser?.username}`,
			icon: FaUser,
			auth: true,
		}
	];

	return (
		<div className='col-span-1 h-full '>
			<div className='flex flex-col items-center'>
				<div className='space-y-2 lg:w-[230px]'>
					<SidebarLogo />
					{items.map((item) => (
						<SidebarItem
							key={item.href}
							href={item.href}
							label={item.label}
							icon={item.icon}
							auth={item.auth}
						/>
					))}
					{currentUser && (
						<SidebarItem onClick={() => signOut()} icon={BiLogOut} label='Logout' />
					)}
					<SidebarPostButton />
				</div>
			</div>
		</div>
	);
}
 
export default Sidebar;