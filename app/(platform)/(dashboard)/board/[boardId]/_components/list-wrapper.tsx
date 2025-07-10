interface ListWrapperProps {
    children: React.ReactNode;
}

export const ListWrapper = ({
    children
}: ListWrapperProps) =>{

    return(
        <li>
            {children}
        </li>
    )
}