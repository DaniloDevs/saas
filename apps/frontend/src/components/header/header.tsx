import ProfileButton from "./profile-button";


export default async function Header() {
     return (
          <div className="mx-auto flex max-w-[1200px] items-center justify-between">
               <div className="flex items-center gap-3">
                    <h1 className="font-serif text-2xl">Mysthic Sheeat</h1>
               </div>

               <div className="flex items-center gap-4">
                    <ProfileButton />
               </div>
          </div>
     );
}