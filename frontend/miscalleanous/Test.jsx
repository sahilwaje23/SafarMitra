// below is an example on how to use both material and tailwind css in the same component
// sx prop needs an object inside which we write raw css to override current styles
// recommended to use tailwind on parent component and material on child components
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
const Test = () => {
    return (
        <>
            <div className="bg-gray-900 p-4 rounded-4xl flex flex-col items-center justify-center w-auto">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2,gap:'13px' }}>
                    <img className='border' src="/safarmitra.svg" alt="description" style={{ maxWidth: '100%', maxHeight: '100%' ,padding:'1px',margin:'1rem 1rem',transform: 'scale(0.5)'}} />
                </Box>
                <Button variant="contained" color="primary" sx={{borderRadius: '2rem',maxWidth: '100%', height: 'auto'}} >   
                    hey world
                </Button>
            </div>

        </>
    )
}
export default Test;