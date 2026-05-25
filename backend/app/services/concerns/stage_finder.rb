module StageFinder
  # Finds the first record in an ActiveRecord relation whose sequence matches the given number.
  #
  # @param relation [ActiveRecord::Relation] The relation of stage-like records to search within.
  #                                          Must respond to #where and #find_by.
  # @param sequence_number [Integer] The sequence number to match.
  # @return [ActiveRecord::Base, nil] The first matching record, or nil if not found,
  #                                   relation is blank, or sequence_number is nil.
  def self.find_by_sequence(relation, sequence_number)
    return nil if relation.blank? || sequence_number.nil?
    relation.find_by(sequence: sequence_number)
  end

  # Filters a relation to include only records whose sequence matches the given number.
  #
  # @param relation [ActiveRecord::Relation] Same as above.
  # @param sequence_number [Integer] Same as above.
  # @return [ActiveRecord::Relation] A relation containing all matching records. Returns an empty relation
  #                                  if none found, relation is blank, or sequence_number is nil.
  def self.filter_by_sequence(relation, sequence_number)
    return relation.none if relation.blank? || sequence_number.nil?
    relation.where(sequence: sequence_number)
  end
end
