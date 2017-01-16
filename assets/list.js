/**
* A helper class for the list page
*/
class ModelList {

  /**
   * Represents a ModelList helper object.
   * @constructor
   */
  constructor(modelName, attributes) {
    this.modelName = modelName;
    this.attributes = attributes;
  }

  /**
  * Gets The data for the current model.
  * @return {promise} A promise to use to get the records.
  */
  getRecords() {
    return fetch(`/${this.modelName}`).then(response => response.json());
  }

  /**
  * Sorts the attributes of the attributes object in a user friendly order.
  * @return {[Object]} An array with the attributes sorted alphabetically.
  */
  getSortedAttributes() {
    const firstItems = ['id', 'name'];
    const secondItems = ['createdAt', 'updatedAt'];
    let sortedAttributes = [];

    // Sort attributes in a user friendly order
    sortedAttributes = Object.keys(this.attributes) // get array of keys
    .filter( // take out pre-indexed items
      item => firstItems.indexOf(item) == -1 &&
      secondItems.indexOf(item) == -1
    )
    .sort();

    // prepend first items and append last items
    sortedAttributes = firstItems.concat(sortedAttributes, secondItems);

    // Convert the attributes back to their objects
    sortedAttributes = sortedAttributes.map(attr => {
      const thingToReturn = {};
      thingToReturn[attr] = this.attributes[attr];
      return thingToReturn;
    });

    return sortedAttributes;
  }

  /**
  * Converts the value given to a user friendly string.
  * @param {string} attributeValue The value to convert.
  * @param {Object} attribute The attribute object itself, specifying its properties.
  * @return {string} The friendly attribute name
  */
  getFriendlyValueName(attributeValue, attribute){
    if(attributeValue === null || attributeValue === undefined) {
      return null;
    } else if (attribute.collection) {
      return `${attributeValue.length} ${attribute.collection}`;
    } else if(attribute.model){
      return attributeValue.name;
    } else if(['datetime'].indexOf(attribute.type) != -1) {

      const pad = number => {
        number = number.toString();
        return number.length == 1 ? `0${number}` : number;
      };
      const date = new Date(attributeValue);
      return date.toUTCString();

    } else {
      return attributeValue;
    }
  }

  /**
  * Deletes A record from the database.
  * @return A promise for the delete event.
  */
  deleteRecord(record) {
    return fetch(`/${modelList.modelName}/${record.id}`, {
      'method': 'DELETE',
      'body': record
    });
  }

  /**
   * Checks whether is value is empty. My empty, what is meant is null,
   * undefined, empty string, or whitespace.
   * @param value {string} The value to check.
   * @return isEmpty {boolean} Whether the value is empty.
   */
  isEmpty(value){
    const emptyValues = [null, undefined, ''];
    if(typeof value == 'string'){
      value = value.replace(' ', '');
    }

    return emptyValues.indexOf(value) != -1;
  }
}

const modelName = currentModel.name; // inherited from list.ejs
const attributes = currentModel.attributes; // inherited from list.ejs
const modelList = new ModelList(modelName, attributes);

// When user submits search query
document.getElementById('form-search').addEventListener('submit', event => {
  event.preventDefault(); // prevents the page from reloading

  const query = document.getElementById('search').value.toLowerCase();
  const trs = Array.from(document.querySelectorAll('table tbody tr'));

  // Search filter algorithm
  const searchResults = trs.filter(tr => {
    const value = JSON.parse(tr.dataset.value);
    const name = value.name.toLowerCase();
    return name.indexOf(query) != -1;
  });

  // Display the ones that pass the test
  trs.forEach(tr => {
    if(searchResults.indexOf(tr) != -1){
      tr.style.display = null;
    } else {
      tr.style.display = 'none'; // invisible
    }
  });

});

// When the user submits the sort attribute <form>
document.getElementById('form-sort-attributes').addEventListener('submit', event => {
  event.preventDefault(); // prevent the default action of the submit button (because by default, it wil refresh the page)
  const attribute = document.getElementById('select-sort-attributes').value;
  const thForAttribute = document.querySelector(`th[data-attribute=${attribute}]`);
  thForAttribute.click();
});

// Keyboard shortcuts for page
document.querySelector('body').addEventListener('keyup', function(event){

  if(document.getElementById('search') == document.activeElement) return;

  // If they press the 'N' key
  switch (event.key) {
    case 'n':
    document.getElementById('add-new').click();
    break;
    case '/':
    document.getElementById('search').focus();
  }
});

// Handles the control panel toggle button
document.getElementsByClassName('toggle-control-panel')[0].addEventListener('click', event => {
  const controlPanel = document.getElementsByClassName('sidebar')[0];
  controlPanel.classList.toggle('minimized');
});

/** This creates the sort options that users can select in the control bar */
(function createAttributeSortOptions() {

  const select = document.getElementById('select-sort-attributes');

  modelList.getSortedAttributes().forEach(attribute => {
    const attributeName = Object.keys(attribute)[0];
    const option = document.createElement('option');

    option.innerHTML = attributeName;
    select.appendChild(option);
  });
})();

/** Creates the table's headers */
(function createAttributeCheckboxes() {
  const fieldset = document.getElementById('fieldset-attributes');
  const toggleAllCheckbox = document.getElementById('toggle-attributes');

  toggleAllCheckbox.addEventListener('change', event => {
    const checked = event.target.checked;
    Array.from(
      document.getElementsByClassName('checkbox-attribute')
    ).forEach(checkbox => checkbox.checked != checked ? checkbox.click() : null);
  });

  // Output checkboxes for each attribute
  modelList.getSortedAttributes().forEach(attribute => {
    attribute = Object.keys(attribute)[0];
    const container = document.createElement('div');
    const checkbox = document.createElement('input');
    const label = document.createElement('label');

    checkbox.type = 'checkbox';
    checkbox.setAttribute('checked', 'checked'); // Check all the boxes
    checkbox.classList.add('checkbox-attribute');
    checkbox.id = `attr-${attribute}`;

    checkbox.addEventListener('change', event =>{
      const checked = event.target.checked;
      Array.from(
        document.querySelectorAll(`th[data-attribute=${attribute}], td[data-attribute=${attribute}]`)
      ).forEach(cell => cell.style.display = checked ? null : 'none');
    });

    label.innerHTML = attribute;
    label.setAttribute('for', checkbox.id);

    container.appendChild(checkbox);
    container.appendChild(label);

    fieldset.appendChild(container);
  });
})();

/** Create table headers */
(function createTableHeaders(){
  const theadTr = document.querySelector('table thead tr');
  const editTh = document.createElement('th');

  document.getElementById('title').innerHTML = `${modelList.modelName}`;
  document.getElementById('add-new').href = `/models/${modelList.modelName}/create`;
  editTh.innerHTML = 'Edit';
  theadTr.appendChild(editTh);

  // convert attributes to th
  modelList.getSortedAttributes().forEach(attr => {
    const arrowsContainer = document.createElement('div');
    const keys = Object.keys(attr);
    const downArrow = document.createElement('span');
    const nameSpan = document.createElement('span');
    const properties = attr[name];
    const th = document.createElement('th');
    const thContainer = document.createElement('div');
    const upArrow = document.createElement('span');
    let initialOrderById = null;

    upArrow.innerHTML = '▲';
    downArrow.innerHTML =  '▼';
    upArrow.style.display = 'none'; // invisible
    downArrow.style.display = 'none'; // invisible

    arrowsContainer.classList.add('container');
    arrowsContainer.classList.add('container-arrows');
    arrowsContainer.appendChild(upArrow);
    arrowsContainer.appendChild(downArrow);

    th.dataset.attribute = keys[0];

    // When the user clicks a <th> (to sort)
    th.addEventListener('click', event => {
      const attributeName = th.dataset.attribute;
      const attributeProperties = attributes[attributeName];
      const tbody = document.querySelector('tbody');
      const trs = Array.from(tbody.getElementsByTagName('tr'));

      if(!initialOrderById){
        initialOrderById = trs.map(tr => JSON.parse(tr.dataset.value).id);
      }

      // Can be 'ascending', 'descending', or null. Null means not sorted;
      let targetSort = null; // the sort that the user is attempting

      if(upArrow.style.display == 'none'){
        if(downArrow.style.display == 'none'){
          targetSort = 'ascending';
        } else {
          // downArrow.style.opacity == 1
          targetSort = null;
        }
      } else {
        // upArrow.style.opacity == 1
        targetSort = 'descending';
      }

      if(!targetSort){
        // Then they're trying to unsort the data

        upArrow.style.display = 'none';
        downArrow.style.display = 'none';

        initialOrderById.map(id => trs.filter(tr => JSON.parse(tr.dataset.value).id == id)[0]) // convert ids to TRs
        .forEach(tr => tbody.appendChild(tr)); // append to table

      } else {
        // They're trying to sort the data

        // The sorted table rows
        const trsSorted = trs.sort((tr1, tr2) => {
          // TODO: Fix it so it can sort rows that have expanded collection attribute values
          // TODO: Fix so it can sort model values

          let winner = null;
          let tr1Value = JSON.parse(tr1.dataset.value)[th.dataset.attribute];
          let tr2Value = JSON.parse(tr2.dataset.value)[th.dataset.attribute];

          const tr1ValIsEmpty = modelList.isEmpty(tr1Value);
          const tr2ValIsEmpty = modelList.isEmpty(tr2Value);

          // If one is undefined
          if(tr1ValIsEmpty && !tr2ValIsEmpty) return targetSort == 'ascending' ? 1 : -1;
          if(tr2ValIsEmpty && !tr1ValIsEmpty) return targetSort == 'ascending' ? -1 : 1;
          if(tr1ValIsEmpty && tr2ValIsEmpty) return;

          // If the values are foreign models
          if(attributeProperties.model){
            // convert the values to their foreign model's 'name'
            tr1Value = tr1Value.name;
            tr2Value = tr2Value.name;
          }

          // Number compare
          if(typeof tr1Value == 'number' && typeof tr2Value == 'number'){
            if(targetSort == 'ascending') winner = tr1Value - tr2Value;
            if(targetSort == 'descending') winner = tr2Value - tr1Value;

            // String compare (and foreign model compare)
          } else if (tr1Value.localeCompare && tr2Value.localeCompare){
            if(targetSort == 'ascending') winner = tr1Value.localeCompare(tr2Value);
            if(targetSort == 'descending') winner = tr2Value.localeCompare(tr1Value);

            // Whatever compare
          } else {
            if(targetSort == 'ascending') winner = tr1Value > tr2Value;
            if(targetSort == 'descending') winner = tr2Value < tr1Value;
          }

          return winner;

        });

        // Show the <tr>s sorted
        tbody.innerHTML = '';
        trsSorted.forEach(tr => {
          tbody.appendChild(tr);
        });

        // Toggle arrows
        upArrow.style.display = targetSort == 'ascending' ? 'initial' : 'none';
        downArrow.style.display = targetSort == 'ascending' ? 'none' : 'initial';
      }
    });

    nameSpan.innerHTML = keys[0];

    thContainer.appendChild(nameSpan);
    thContainer.appendChild(arrowsContainer);
    thContainer.classList.add('container');
    thContainer.classList.add('container-th');

    th.appendChild(thContainer);
    theadTr.appendChild(th);
  });

  const deleteTh = document.createElement('th');
  deleteTh.innerHTML = 'Delete';
  theadTr.appendChild(deleteTh);
})();

/** Display the data */
modelList.getRecords().then(data => data.forEach(item => {
  // For loop that run for each record in table
  const deleteTd = document.createElement('td');
  const deleteLink = document.createElement('a');
  const editTd = document.createElement('td');
  const editLink = document.createElement('a');
  const tr = document.createElement('tr');

  editLink.innerHTML = 'Edit';
  editLink.href = `/models/${modelList.modelName}/${item.id}`;
  editTd.appendChild(editLink);

  deleteLink.innerHTML = 'Delete';
  deleteLink.href = `/models/${modelList.modelName}`;
  deleteLink.onclick = event => {
    event.preventDefault();
    const warningMessage = `Are you sure you want to delete this item?\n\n${JSON.stringify(item)}`;
    if(confirm(warningMessage)){
      modelList.deleteRecord(item).then(response => {
        location.href = deleteLink.href;
      });
    }
  };
  deleteTd.appendChild(deleteLink);
  tr.appendChild(editTd);

  // For loop that runs for each attrubte of a record
  modelList.getSortedAttributes().forEach(attr => {
    const keys = Object.keys(attr);
    const attrName = keys[0];
    const attrProperties = attr[attrName];
    const value = item[attrName];
    const td = document.createElement('td');
    let name = modelList.getFriendlyValueName(value, attrProperties);

    td.dataset.attribute = keys[0];

    if(attrProperties === undefined) {
      // if the user forgets to add the name to a model, inform the user, then skip the rest of the code.
      alert("Missing property '" + attrName + "' in model '" + modelList.modelName + "'");
      td.innerHTML = "";
      tr.appendChild(td);
      document.querySelector('table tbody').appendChild(tr);
      return;
    }

    // If the attribute is a foreign model, make it a link to that model.
    if(attrProperties.model){
      if(value){
        const a = document.createElement('a');
        a.innerHTML = `#${value.id} ${name}`;
        a.href = `/models/${attrProperties.model}/${value.id}`;
        a.title = `#${value.id}`; // hover
        td.appendChild(a);
      } else {
        td.title = 'null';
      }
    } else {
      // If not a foreign key

      // If the current attribute is a collection (a 1-to-N relationship)
      if(attrProperties.collection){
        const button = document.createElement('button'); // Expand / shrink button
        const container = document.createElement('div');
        const expandCode = '▼';
        const shrinkCode = '▲';
        const span = document.createElement('span'); // The value (the text)

        container.classList.add('container');
        container.classList.add('container-flex-center');
        button.classList.add('expand-shrink-button');
        button.innerHTML = expandCode;

        // Handler function for when the button is clicked
        button.addEventListener('click', event => {
          // Convert the button to a shrink icon
          let isExpanded = button.innerHTML == shrinkCode;
          button.innerHTML = isExpanded ? expandCode : shrinkCode;

          const elementsClickedOn = event.path;
          const clickedTd = elementsClickedOn.filter(element => element.tagName == 'TD')[0];
          const tdContainer = clickedTd.getElementsByClassName('container')[0];
          const clickedTr = elementsClickedOn.filter(element => element.tagName == 'TR')[0];
          const tds = clickedTr.getElementsByTagName('td');

          if(isExpanded){
            /**
            * 1. Delete the newly created TRs
            * 2. Convert the TDs to rowspan == 1
            * 3. Fix the value being displayed
            */

            // Step 1
            for(let i = 1; i < value.length; i++){
              const trToDelete = clickedTr.nextSibling;
              clickedTr.parentNode.removeChild(trToDelete);
            }

            // Step 2
            for(let i = 0; i < tds.length; i++){
              tds[i].setAttribute('rowspan', 1);
            }

            // Step 3
            const childToDelete = tdContainer.getElementsByClassName('value-child')[0];
            childToDelete.parentNode.removeChild(childToDelete);
            tdContainer.getElementsByClassName('value')[0].style.display = 'initial';

          } else {
            /**
            * 1. Convert the other TDs into rowspan = the number of items
            * 2. Split the td (with the collection) into multiple tds (specifically, into the amount of items)
            */

            //  For each td in the tr
            for(let i = 0; i < tds.length; i++){
              const td = tds[i];

              // If the current td is not the one they clicked on
              if(td != clickedTd){
                td.setAttribute('rowspan', value.length); // value.length == number of items in collection
              }
            }

            const clickedTable = elementsClickedOn.filter(element => element.tagName == 'TABLE')[0];

            // The first one has to be manually created
            const newA = document.createElement('a');
            const firstValue = value[0];
            newA.innerHTML = `#${firstValue.id} ${firstValue.name}`;
            newA.href = `/models/${attrProperties.collection}/${firstValue.id}`;
            newA.classList.add('value-child');
            tdContainer.insertBefore(newA, tdContainer.firstChild);
            tdContainer.getElementsByClassName('value')[0].style.display = 'none';

            //  Then create the rest
            for(let i = 1; i < value.length; i++){
              const newTr = document.createElement('tr');
              const newTD = document.createElement('td');
              const newA = document.createElement('a');
              const currentValue = value[i];

              newA.innerHTML = `#${currentValue.id} ${currentValue.name}`;
              newA.href = `/models/${attrProperties.collection}/${currentValue.id}`;
              newTD.appendChild(newA);
              newTr.appendChild(newTD);

              clickedTr.parentNode.insertBefore(newTr, clickedTr.nextSibling);
            }
          }

        });
        span.innerHTML = name;
        span.classList.add('value');

        container.appendChild(span);

        // TODO: Make this more efficient. The button shouldn't exist AT ALL if there's no values
        if(value.length > 0){
          container.appendChild(button);
        }

        td.appendChild(container);
      } else {
        td.innerHTML = name;
      }

    }
    tr.appendChild(td);
    document.querySelector('table tbody').appendChild(tr);
  });

  tr.dataset.value = JSON.stringify(item);
  tr.appendChild(deleteTd);

}));
