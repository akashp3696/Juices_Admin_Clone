import React from 'react'
import TextField from '@mui/material/TextField';
function BlogForm() {
  return (
<>
    <h1>Add Blog</h1>
    <br/>
    <br/>
    <div className='blogtitles' style={{display:'flex' , flexDirection:'row' , gap:'20px'}}>
    <div style={{display:'flex' , flexDirection:'column' , width:"100%"}}>
        <label>Blog Title</label>
        <TextField id="outlined-basic" label="Outlined" variant="outlined" />
    </div>
    <div style={{display:'flex' , flexDirection:'column', width:"100%"}}>
        <label>Blog Description</label>
        <TextField id="outlined-basic" label="Outlined" variant="outlined" />
    </div>

    </div>
    <br/>
    <br/>
    <div className='blogtitles' style={{display:'flex' , flexDirection:'row' , gap:'20px'}}>
    <div style={{display:'flex' , flexDirection:'column' , width:"100%"}}>
        <label>Blog Title</label>
        <TextField id="outlined-basic" label="Outlined" variant="outlined" />
    </div>
    <div style={{display:'flex' , flexDirection:'column', width:"100%"}}>
        <label>Blog Description</label>
        <TextField id="outlined-basic" label="Outlined" variant="outlined" />
    </div>

    </div>
    <br/>
    <br/>
<button style={{height:"50px" , backgroundColor:'#62B34F', color:'white',border:'none',paddingLeft:'20px',paddingRight:'20px',borderRadius:'15px'}}>Add Blog</button>


</>
  )
}

export default BlogForm