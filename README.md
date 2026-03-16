# [Julius de Waal Model Catalogue](https://non-bin.github.io/juliusDeWaal/)

[Open search tool](https://non-bin.github.io/juliusDeWaal/searchTool.html)

Models are metric unless otherwise specified in the Notes column  
Make sure to check the Issues column  
Some pdfs contain multiple consecutive projects, I have split them where I can  
I've input all this data manually and to the best of my knowledge of steam engine, so I'm sorry if I made any mistakes  
I've used the Project No from the drawings where available, or if something like a project number is in the file name, otherwise I fall back to the drawing number (which is put in AKA otherwise). I had to make up an identifier for the one I called "SCOTCH-YOKE-4" using the original file name

## Layout

[./catalog.csv](catalog.csv) has data about each drawing  
[./drawings/](drawings/) contains all the drawings, named with their `Project No` as in the catalog  
[./thumbnails/](thumbnails/) contains preview images, named with their `Project No` as in the catalog

## Sources

https://www.modelesavapeur.com  
https://www.modelismeenpolynesie.com  
https://www.vapeuretmodelesavapeur.com  
https://www.modelengineeringwebsite.com

## Progress

The live spreadsheet can be found [here](https://docs.google.com/spreadsheets/d/1T9bU-pIu0uPjZjIc4qJgrraPnAQn-d8j8YymiJNhWZQ/edit?usp=sharing)

I have added all files that I've found to this repo, and I have completed all the details up to `10-27-00`

I have emailed Julius, and James (the maintainer of modelesavapeur), but I'm yet to receive a response with a better source of drawings, so I used the following command to download every file linked to on the website

```bash
wget \
 --continue `# Resume an interrupted download` \
 --recursive `# Follow links to more files and pages, and follow links in those pages etc` \
 --level=inf `# Keep recursing forever` \
 --convert-links `# Change links in the downloaded pages to point to downloaded files and pages` \
 --adjust-extension `# Give files the correct extension for their MIME type` \
 --span-hosts `# Don't restrict the search to just the starting domain` \
 --domains "www.modelesavapeur.com,www.modelismeenpolynesie.com" `# Restrict the search to only these domains` \
 --restrict-file-names=windows `# Don't create illegal file names` \
 https://www.modelesavapeur.com `# Start here`
```
