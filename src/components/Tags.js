import React from 'react'
import {Link} from 'react-router-dom'

const Tags = ({posts, freshPostHandler}) => {

    let tags = []
    let tagFound = false

    for(let i = 0; i < posts.length; i++){
        for(let j = 0; j < posts[i].tags.length; j++){
            for(let k = 0; k < tags.length; k++){   
                if(tags[k][0] === posts[i].tags[j]){
                    tags[k][1] = tags[k][1] + 1
                    tagFound=true;
                }
            }
            if(tagFound !== true){
                tags.push([posts[i].tags[j], 1])
            }
            tagFound = false
        }
    }

    
    const sortedTags = [].concat(tags)
    .sort((a,b) => a[1] < b[1] ? 1 : -1)


    return(
        <div className="row">
            <div className="col-12">
                <h2>Tags</h2>
                {sortedTags.map(tag => (
                    <Link key={tag} to={`/posts/${tag[0]}`} style={{ color: 'red' }}><button type="button" className="tag btn btn-primary" onClick={() => {freshPostHandler()}} ><span>{tag[0]} ({tag[1]})</span></button></Link>
                ))}
        
            </div>
        </div>
    )
}

export default Tags