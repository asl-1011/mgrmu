let studentData = [];

async function loadAndDecryptData() {
    const phoneKey = document.getElementById('phoneKey').value.trim();
    const dobKey = document.getElementById('dobKey').value.trim();
    const decryptionKey = `35dce61cfe69f513d179e8f0b84ee2a2${phoneKey}${dobKey}`;

    try {
        const response = await fetch(
            'https://raw.githubusercontent.com/asl-1011/mgr/refs/heads/main/encrypted_2023_sri_gou.json'
        );
        const encryptedData = await response.text();
        const decryptedData = CryptoJS.AES.decrypt(encryptedData, decryptionKey);
        const parsedData = decryptedData.toString(CryptoJS.enc.Utf8);

        if (!parsedData) throw new Error('Invalid Keys! Decryption Failed.');
        
        document.querySelector('.table-container').style.display = 'block';
        studentData = JSON.parse(parsedData);
        displayData(studentData);
    } catch (error) {
        alert('Decryption failed! Please check your keys and try again.');
        console.error(error);
    }
}

document.getElementById('decryptButton').addEventListener('click', loadAndDecryptData);

function displayData(data, filters = {}) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    Object.values(data).forEach((student) => {
        if (filters.gender && student.Gender !== filters.gender) return;
        if (filters.malayali !== undefined) {
            const isMalayali = student["Mother Tongue"] === "Malayalam";
            if (filters.malayali !== isMalayali) return;
        }

        const row = `<tr>
            <td>${student.Name}</td>
            <td><button class='view-btn' onclick='viewDetails(${JSON.stringify(student)})'>👁️</button></td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function applyFilters() {
    const gender = document.getElementById('filterGender').value;
    const malayali = document.getElementById('filterMalayali').value;

    const filters = {
        gender: gender !== 'all' ? gender : null,
        malayali: malayali !== 'all' ? malayali === 'yes' : undefined,
    };
    displayData(studentData, filters);
}

document.getElementById('filterGender').addEventListener('change', applyFilters);
document.getElementById('filterMalayali').addEventListener('change', applyFilters);

function viewDetails(student) {
    document.getElementById('studentName').innerText = student.Name;
    document.getElementById('studentDetails').innerHTML = Object.entries(student)
        .map(([key, value]) => `<strong>${key}:</strong> ${value} <br>`) 
        .join('');
    
    document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}
