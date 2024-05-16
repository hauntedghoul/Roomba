import React from 'react';
import './save.css'

function Save() {
    return (
        <div className="dialog">
            <p>Are you sure you want to save?</p>
            <button class="confirm">Confirm</button>
            <button class="cancel">Cancel</button>
        </div>
    );
}

export default Save;