
import { UserIcon } from '@heroicons/react/24/solid'

export default function Header() {

    return <>
        <div className="p-2 h-15 mb-5 border-b border-[whitesmoke] flex justify-between">
            <div className="flex justify-center align-center self-center italic">VC Assist</div>
            <div className="flex items-center space-x-2 mx-5">
                <UserIcon className="h-6 w-6 text-gray-600  cursor-pointer" />
            </div>
        </div>
    </>
}