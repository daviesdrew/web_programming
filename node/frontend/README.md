
## Once Node / Express / Mongo set up as per README.md in project root

Change to client directory (where this README is located) 

    cd client


To install all React related dependencies: (make sure you're in `client`)

    npm install

Once installed, return to project root and start node index.js (follow instructions in README there) 
(If you haven't already - should have node server running on port 4000)

Once node `index.js` is running
Return to client folder:

    cd client

And start React server:

    npm start

you should now be able to visit site in browser at `localhost:3000`

  
## Main Organization

State of the application is currently only handled in BrowseView or SearchView. These components also pass down functions to their child stateless components so events on them can be handled appropriately. 
- Whenever anything important is changed, BrowseView or SearchView will change its state - passing the changes down to 
- Whenever a stateful component's state is changed (note: this should only ever be done via `setState({})`)- it triggers a render and applies changes to DOM where necessary.
- There should only be one 'true state' for components - which is why `BrowseView` and `SearchView` are regularly passing their state down to stateless components. 

Eventually Contact, Admin and possibly Login should also be stateful components.

The D3 / Leaflet components may need to be stateful as well using the React `ref` attribute (though it is preferable to keep as much of the components stateless as possible - there may be no way around it here).

### Folder Organization
By making a folder for a component, say ComponentX, we need only create a directory for ComponentX and add an `index.js` and `index.css` file into that directory. It can then be imported via `import ComponentX from './ComponentX/'`.

###High-level Architecture
- `Manuscript`, `Apocrypha` and `Bibliography` all handle displaying the results list (since each will have different requiriements here) from Browses and Searches. These are used by both Browse and Search.

- `Browse` and `Search` folders contain most of the functionality. Search is divided into `SearchForm` and `SearchResults` panels. Since each type of document (MS, Apoc, Biblio) will require completely different search fields and results logic, `SearchForm` is divided into 

##Important Stateful Components
###App
- the App component currently handles the navigation / React Browser functions

###BrowseView (`/src/Browse/index.js`)
- Browse is a stateful component and handles the state for all browsing view related activity
- Some of the children have React Hooks to handle simple appearance state (DOM manipulation is an anti-pattern in React - use React Hooks within stateless components to handle simple state where needed)

###SearchView (`/src/Search/index.js`)
- Search is a stateful component and handles the state for all searching related activity. 
- Keeps track of - state of the search form (which values are filled out), list of results, which tabs the user has opens, etc 




