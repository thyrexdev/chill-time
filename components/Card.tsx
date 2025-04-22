import Link from 'next/link'
import Image from "next/image";

interface CardProps {
    type: string,
    id: string,
    poster: string,
    title: string,
    genre?: (string | undefined)[],
    rating?: number,
    release?: string | undefined,
    language?: string
}

const Card: React.FC<CardProps> = ({type, id, poster, title}) => {

    return (
        <div id='bx' className=' relative w-[180px] h-[290px] m-[10px] rounded-[20px] lg:mb-[80px] mb-[60px] ' key={id}>
            <Link href={`/${type}/${id}`}>
                <Image fill className=' w-full h-full rounded-[20px] ' alt={`${id}`} src={`${poster}`}/>
                <div id='details' className=' absolute w-full h-[25%] z-[1]'>
                    <h3 className=' text-white pt-[5px] pl-[5px] text-lg m-0 cursor-pointer'>{`${title}`}</h3>

                </div>
            </Link>
        </div>
    )
}

export default Card
