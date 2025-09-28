import json
import os
from collections import defaultdict

def validate_nft_uniqueness():
    """Validate that all 4444 NFTs are truly unique"""
    
    print("Validating uniqueness of 4444 NFT collection...")
    
    if not os.path.exists("generated_nfts/metadata"):
        print("❌ Metadata directory not found. Run generate-4444-organisms.py first.")
        return False
    
    # Track uniqueness across multiple dimensions
    unique_hashes = set()
    trait_combinations = set()
    parameter_combinations = set()
    duplicates_found = []
    
    # Load all metadata files
    for token_id in range(1, 4445):
        metadata_file = f"generated_nfts/metadata/{token_id}.json"
        
        if not os.path.exists(metadata_file):
            print(f"❌ Missing metadata for token {token_id}")
            continue
            
        with open(metadata_file, 'r') as f:
            metadata = json.load(f)
        
        # Create unique identifiers
        param_hash = f"{metadata['fractalDepth']}-{metadata['complexity']}-{metadata['colorVariant']}-{metadata['rotationFactor']}-{metadata['scaleFactor']}"
        trait_combo = f"{metadata['organism']}-{metadata['era']}-{param_hash}"
        
        # Check for duplicates
        if param_hash in parameter_combinations:
            duplicates_found.append({
                'token_id': token_id,
                'duplicate_type': 'parameters',
                'hash': param_hash
            })
        
        if trait_combo in trait_combinations:
            duplicates_found.append({
                'token_id': token_id,
                'duplicate_type': 'traits',
                'hash': trait_combo
            })
        
        # Add to tracking sets
        unique_hashes.add(f"{token_id}-{param_hash}")
        parameter_combinations.add(param_hash)
        trait_combinations.add(trait_combo)
    
    # Report results
    total_loaded = len(unique_hashes)
    total_duplicates = len(duplicates_found)
    
    print(f"\n📊 UNIQUENESS VALIDATION RESULTS:")
    print(f"✅ Total NFTs validated: {total_loaded}/4444")
    print(f"🔍 Unique parameter combinations: {len(parameter_combinations)}")
    print(f"🎨 Unique trait combinations: {len(trait_combinations)}")
    
    if total_duplicates == 0:
        print(f"🎉 SUCCESS: All {total_loaded} NFTs are completely unique!")
        print(f"✨ No duplicates found across parameters or trait combinations")
        
        # Generate uniqueness report
        uniqueness_report = {
            "validation_date": "2024-10-01",
            "total_nfts": total_loaded,
            "unique_parameters": len(parameter_combinations),
            "unique_traits": len(trait_combinations),
            "duplicates_found": 0,
            "uniqueness_guaranteed": True,
            "validation_passed": True
        }
        
        with open("generated_nfts/uniqueness_report.json", 'w') as f:
            json.dump(uniqueness_report, f, indent=2)
            
        return True
    else:
        print(f"⚠️  WARNING: {total_duplicates} potential duplicates found:")
        for dup in duplicates_found[:10]:  # Show first 10
            print(f"   - Token {dup['token_id']}: {dup['duplicate_type']} duplicate")
        
        if len(duplicates_found) > 10:
            print(f"   ... and {len(duplicates_found) - 10} more")
            
        return False

def generate_rarity_distribution():
    """Generate rarity distribution analysis"""
    
    rarity_counts = defaultdict(int)
    era_counts = defaultdict(int)
    organism_counts = defaultdict(int)
    
    for token_id in range(1, 4445):
        metadata_file = f"generated_nfts/metadata/{token_id}.json"
        
        if os.path.exists(metadata_file):
            with open(metadata_file, 'r') as f:
                metadata = json.load(f)
            
            # Count rarities (would need to be calculated based on parameters)
            # For now, simulate based on complexity and depth
            complexity = metadata.get('complexity', 0.5)
            depth = metadata.get('fractalDepth', 5)
            
            rarity_score = depth + complexity
            if rarity_score >= 8.5:
                rarity = "Legendary"
            elif rarity_score >= 7.5:
                rarity = "Epic"
            elif rarity_score >= 6.5:
                rarity = "Rare"
            elif rarity_score >= 5.5:
                rarity = "Uncommon"
            else:
                rarity = "Common"
            
            rarity_counts[rarity] += 1
            era_counts[metadata['era']] += 1
            organism_counts[metadata['organism']] += 1
    
    print(f"\n📈 RARITY DISTRIBUTION:")
    for rarity, count in sorted(rarity_counts.items(), key=lambda x: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'].index(x[0])):
        percentage = (count / 4444) * 100
        print(f"   {rarity}: {count} ({percentage:.1f}%)")
    
    print(f"\n🌍 ERA DISTRIBUTION:")
    for era, count in sorted(era_counts.items()):
        percentage = (count / 4444) * 100
        print(f"   {era}: {count} ({percentage:.1f}%)")
    
    # Save distribution report
    distribution_report = {
        "rarity_distribution": dict(rarity_counts),
        "era_distribution": dict(era_counts),
        "organism_distribution": dict(organism_counts),
        "total_analyzed": sum(rarity_counts.values())
    }
    
    with open("generated_nfts/distribution_report.json", 'w') as f:
        json.dump(distribution_report, f, indent=2)

if __name__ == "__main__":
    # Validate uniqueness
    is_unique = validate_nft_uniqueness()
    
    # Generate distribution analysis
    generate_rarity_distribution()
    
    if is_unique:
        print(f"\n🚀 READY FOR LAUNCH: Collection validated as 100% unique!")
    else:
        print(f"\n⚠️  NEEDS ATTENTION: Please resolve duplicates before launch")
