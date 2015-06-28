var Content = React.createClass({
    loadWordsFromServer: function() {
        $.ajax({
            url: this.props.url + "?type=getWords",
            //url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
                //console.log(data);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleWordSubmit: function(word) {
        console.log("Adding word: " + JSON.stringify(word));
        $.ajax({
            url: this.props.url + "?type=addWord",
            dataType: 'json',
            type: 'POST',
            data: word,
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleWordDelete: function(id) {
        console.log("Deleting word: " + JSON.stringify(id));
        $.ajax({
            url: this.props.url + "?type=deleteWord",
            dataType: 'json',
            type: 'POST',
            data: id,
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return { data: [] };
    },
    componentDidMount: function() {
        this.loadWordsFromServer();
        setInterval(this.loadWordsFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
            <main className="ui page grid">
                <div className="row">
                    <div className="column">
                        <NavBar />
                        <VocabTable data={this.state.data} onWordSubmit={this.handleWordSubmit} onWordDelete={this.handleWordDelete} />
                    </div>
                </div>
            </main>
        );
    }
});

var NavBar = React.createClass({
    render: function() {
        return (
            <nav className="ui fixed menu inverted navbar">
                <a href="#" className="brand item">Vocabulary List</a>
                <a href="#" className="item active">Home</a>
                <a href="#" className="item">Dictionaries</a>
            </nav>
        );
    }
});

var VocabTable = React.createClass({
    setData: function() {
        var self = this;
        var wordNodes = [];
        $.each(self.props.data, function (index, obj) {
            wordNodes.push(
                <Word id={obj.id} word={obj.word} definition={obj.definition} onWordDelete={self.handleWordDelete} />
            );
        });
        return wordNodes;
    },
    handleWordSubmit: function(word) {
        this.props.onWordSubmit(word);
    },
    handleWordDelete: function(id) {
        this.props.onWordDelete(id);
    },
    render: function() {
        return (
            <div className="vocabTable container">
                <table className="ui table" style={{marginTop:'90px'}}>
                    <thead>
                        <tr>
                            <th>Word</th>
                            <th>Definition</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="type-1">
                        {this.setData()}
                        <tr>
                            <WordForm onWordSubmit={this.handleWordSubmit} />
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
});

var Word = React.createClass({
    handleDelete: function(e) {
        e.preventDefault();
        this.props.onWordDelete({id: this.props.id});
        return;
    },
    handleEdit: function(e) {
        e.preventDefault();
        // Grab buttons
        var editButton = $('#' + this.props.id).find('#editButton');
        var deleteButton = $('#' + this.props.id).find('#deleteButton');
        // Change styling
        editButton.removeClass('blue').addClass('positive');
        deleteButton.removeClass('negative').addClass('yellow');
        // Change text
        editButton.text('Done');
        deleteButton.text('Cancel');
        // Change event handlers
        editButton.attr('onClick', this.handleEditSubmit);
        deleteButton.attr('onClick', this.handleEditCancel);
        return;
    },
    handleEditSubmit: function(e) {
        console.log('submitted edit');
    },
    handleEditCancel: function(e) {
        console.log('cancelled edit');
    },
    render: function() {
        return (
            <tr id={this.props.id}>
                <td>
                    {this.props.word}
                </td>
                <td>
                    {this.props.definition}
                </td>
                <td>
                    <div className="ui buttons">
                        <div className="ui blue basic button" id="editButton" onClick={this.handleEdit}>Edit</div>
                        <div className="negative ui basic button" id="deleteButton" onClick={this.handleDelete}>Delete</div>
                    </div>
                </td>
            </tr>
        );
    }
});

var WordForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var word = React.findDOMNode(this.refs.word).value.trim();
        var definition = React.findDOMNode(this.refs.definition).value.trim();
        if (!word || !definition) {
            return;
        }
        this.props.onWordSubmit({word: word, definition: definition});
        this.handleClear();
        return;
    },
    handleClear: function() {
        var word = React.findDOMNode(this.refs.word).value = '';
        var definition = React.findDOMNode(this.refs.definition).value = '';
        return;
    }, 
    render: function() {
        return (
            <form className="wordForm">
                <td>
                    <div className="ui fluid input focus">
                        <input type="text" ref="word" style={{width:'100%'}} placeholder="New Word" />
                    </div>
                </td>
                <td>
                    <div className="ui fluid input focus">
                        <input type="text" ref="definition" style={{width:'100%'}} placeholder="New Definition" />
                    </div>
                </td>
                <td>
                    <div className="ui buttons">
                        <div className="positive ui basic button" onClick={this.handleSubmit}>Add</div>
                        <div className="ui yellow basic button" onClick={this.handleClear}>Clear</div>
                    </div>
                </td>
            </form>
        );
    }
});

var data = [
    {word: "hello", definition: "world"},
    {word: "credential", definition: "helper"}
]

React.render(
    <Content url="php/dataManager.php" pollInterval={1000} />,
    document.getElementById('content')
);
