import Link from 'next/link';

type ActorCardProps = {
    name: string;
    image: string;
    id: string;
    character: string;
}

const ActorCard: React.FC<ActorCardProps> = ({ name, image, id,character }) => {

    return (
        <div className="relative w-[140px] h-[195px] mt-10" key={id}>
            <Link href={`/actor/${id}`}>
                <img className="w-[120px] h-[175px] rounded-2xl before:bg-cover" src={image} alt={id} />
                <div className='text-left ml-5 mt-2'>
                <p className=" left-25 text-base text-red-300">{name}</p>
                <p className=' left-25 text-base text-gray-600'>{character}</p>
                </div>

            </Link>
        </div>
    );
};

export default ActorCard;
